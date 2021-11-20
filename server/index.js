const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const jimp = require('jimp');
const cors = require('cors');
const sizeOf = require('image-size');
const uuid = require('uuid/v4');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const URL = 'https://127.0.0.1:8443';

app.use(session({
    secret: '#@#42CAMAGRUSESSION#@#',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '4mb'
    })
)

app.use(bodyParser.json({
    limit: '4mb',
}));

// app.use(cors({origin: 'https://10.10.146.166:3000'}));
app.use(cors({origin: 'https://127.0.0.1:3000'}));

app.use('/stickers', express.static('stickers'));

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '**********',
    database: 'camagru'
})

app.post('/check', (req, res) => {
    if(req.session.userId === undefined) {
        res.json(false);
    } else {
        res.json(req.session.userId);
    }
});

conn.connect();

app.get('/', (req, res) => {
    res.send('Connection is successful');
});

app.post('/signin', (req, res) => {
    let id = req.body.id;
    let pwd = req.body.pwd;
    let sess = req.session;

    conn.query('SELECT * FROM user WHERE user_id = ? AND pwd = SHA1(?) AND available = 1', [id, pwd], (err, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (err) {
            console.log(err);
        }
        else if (results.length !== 0) {
            sess.userId = results[0].user_id;
            res.json(true);
        } else {
            res.json(false);
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.userId = undefined;
    res.json(true);
})

app.get('/hello', (req, res) => {
    let id = req.query.id;
    let code = req.query.code;

    conn.query('SELECT * FROM verify WHERE user_id = ? AND code = ?', [id, code], (err, results) => {
        if (err) {
            console.log(err);
        } else if (results.length !== 0) {
            conn.query('DELETE FROM verify WHERE user_id = ? AND code = ?', [id, code], (err) => {
                if (err) {
                    console.log(err);
                } 
            })
            conn.query('UPDATE user SET available = 1 WHERE user_id = ?', [id], (err) => {
                if (err) {
                    console.log(err);
                }
            })
            res.json("Now is available to log in ))");
        }
    })
})

app.post('/signup', (req, res) => {
    let id = req.body.id;
    let pwd = req.body.pwd;
    let pn = req.body.pn;
    let name = req.body.name;
    let code = uuid();
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '42sv.camagru@gmail.com',
            pass: '******'
        }
    });

    const mailOptions = {
        from: '42sv.camagru@gmail.com',
        to: id,
        subject: 'Please confirm this for camagru )',
        html: "<a href=" + URL + "/hello?id=" + id + "&code=" + code + ">Click here to verify !</a>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
    });

    conn.query('INSERT INTO verify (user_id, code) values (?, ?)', [id, code], (err) => {
        if (err) {
            console.log(err);
        }
    })
    
    conn.query('SELECT * FROM user WHERE user_id = ?', id, (err, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (err) {
            console.log(err);
        }
        else if (results.length !== 0) {
            res.json(false);
        } else {
            conn.query('INSERT INTO user (user_id, pwd, pn, name, available) values (?, SHA1(?), ?, ?, ?)', [id, pwd, pn, name, 0], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
            });
            res.json(true);
        }
    })
})

app.post('/change', (req, res) => {
    let id = req.body.id;
    let pwd = req.body.pwd;
    let pn = req.body.pn;
    let name = req.body.name;

    if (req.session.userId !== undefined) { 
        conn.query('UPDATE user SET pwd = SHA1(?), pn = ?, name = ? WHERE user_id = ?', [pwd, pn, name, id], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            else if (results.length === 0) {
                res.json(false);
            } else {
                results = JSON.parse(JSON.stringify(results));
                res.json(true);
            }
        })
    } else {
        res.json(11);
    }
})

app.post('/delete', (req, res) => {
    let id = req.body.id;

    if (req.session.userId !== undefined) {
        conn.query('SELECT pic FROM post WHERE user_id = (SELECT id FROM user WHERE user_id = ?)', [id], (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    fs.unlink(path.join(__dirname, 'temp', results[i].pic), (err) => {
                        if (err) {
                        console.error(err);
                        }
                    })
                }
                conn.query('DELETE FROM user WHERE user_id = ?', [id], (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.json(true);
                    }
                })
            }
        })
    } else {
        req.json(11);
    }
})

app.post('/pic_del', (req, res) => {
    let pic = req.body.pic;
    let user = req.body.user;

    if (req.session.userId === undefined) {
        res.json(11);
    } else {
        conn.query('SELECT * FROM user WHERE user_id = ?', [user], (err, results) => {
            if (err) {
                console.log(err);
            } else if (results.length === 0) {
                res.json(false);
            } else {
                conn.query('DELETE FROM post WHERE pic = ?', [pic], (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        fs.unlink(path.join(__dirname, 'temp', pic), (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json(true);
                            }
                        })
                    }
                })
            }
        })
    }
})

app.post('/submit', (req, res) => {
    let explain = req.body.explain;
    let user = req.body.user;
    let pic = req.body.pic;
    let name = uuid();
    let filter = req.body.filter;
    let sticker = req.body.sticker;

    fs.writeFileSync(path.join(__dirname, 'temp', name), pic.split('data:image/jpeg;base64,')[1], {encoding: 'base64'}, (err) => {
        if(err) {
            console.log(err);
        }
    });

    let array = [{
        src: path.join(__dirname, 'temp', name),
        x: 0,
        y: 0
    }];

    let imageSize = sizeOf('temp/' + name);

    for(let i = 0; i < sticker.length; i++) {
        array = array.concat([{
            src: path.join(__dirname, 'stickers', sticker[i].name),
            x: sticker[i].x,
            y: sticker[i].y
        }]);
    }

    var images = [];

    for(let i = 0; i < array.length; i++) {
        images[i] = array[i].src;
    }

    var jimps = [];

    for (var i = 0; i < images.length; i++) {
        jimps.push(jimp.read(images[i]));
    }

    Promise.all(jimps).then(function(data) {
        return Promise.all(jimps);
    }).then(function(data) {
        for(let i = 1; i < data.length; i++) {
            data[0].crop(0, (imageSize.height - (imageSize.width * 9 / 16)) / 2, imageSize.width, imageSize.width * 9 / 16).composite(data[i].resize(imageSize.width / 17, imageSize.width / 17), array[i].x * imageSize.width, array[i].y * imageSize.height);
        }
        data[0].write('temp/' + name, function() {
            console.log("wrote the image");
        });
    })

    if (req.session.userId !== undefined) {
        conn.query('INSERT INTO post (user_id, `explain`, pic, display, filter) values ((SELECT id FROM user WHERE user_id = ?), ?, ?, ?, ?)', [user, explain, name, 0, filter], (err) => {
            if (err) {
                console.log(err);
            } else {
                fs.writeFileSync(path.join(__dirname, 'temp', name), pic.split('data:image/jpeg;base64,')[1], {encoding: 'base64'}, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
                res.json(true);
            }
        });
    } else {
        res.json(11);
    }
});

app.post('/picture', (req, res) => {
    let user = req.body.user;

    conn.query('SELECT u.name, p.pic, p.temp, p.`explain`, p.display, p.filter, p.time, (SELECT COUNT(*) FROM `like` WHERE post_id = p.id) AS count, (SELECT id FROM `like` WHERE user_id = (SELECT id FROM user WHERE user_id = ?) AND post_id = p.id) AS is_like, (SELECT COUNT(*) FROM comment WHERE user_id = u.id AND post_id = p.id) AS count_text FROM post as p LEFT JOIN user as u ON p.user_id = u.id', [user], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            results = JSON.parse(JSON.stringify(results));
            results.forEach((element, index) => {
                results[index].temp = fs.readFileSync(path.join(__dirname, 'temp', element.pic), {encoding: 'base64'}).toString();
            });
            res.json(results);
        }})
});

app.post('/get_sticker', (req, res) => {
    let sticker = [];
    let index = 0;

    fs.readdirSync('stickers').forEach(file => {
        if(file !== '.DS_Store' && file !== '._.DS_Store') {
            sticker[index] = file;
            index++;
        }
    });
    res.json(sticker);
})

app.post('/like', (req, res) => {
    let id = req.body.id;
    let pic = req.body.pic;
    if (req.session.userId !== undefined) {
        conn.query('SELECT * FROM `like` WHERE user_id = (SELECT id FROM user WHERE user_id = ?) AND post_id = (SELECT id FROM post WHERE pic = ?)', [id, pic], (err, results) => {
            if (err) {
                console.log(err);
            } else if (results.length !== 0) {
                conn.query('DELETE FROM `like` WHERE user_id = (SELECT id FROM user WHERE user_id = ?) AND post_id = (SELECT id FROM post WHERE pic = ?)', [id, pic], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                })
                conn.query('SELECT u.user_id FROM user AS u LEFT JOIN post AS p ON p.user_id = u.id WHERE p.pic = ?', [pic], (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let p_id = JSON.parse(JSON.stringify(results))[0].user_id;

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: '42sv.camagru@gmail.com',
                                pass: '*******'
                            }
                        });
                        const mailOptions = {
                            from: '42sv.camagru@gmail.com',
                            to: p_id,
                            subject: 'Please confirm this for camagru )',
                            html: "<a>" + id + " canceled like button on your picture</a>"
                        };
                    
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            }
                        });
                        res.json(results);
                    }
                })
            } else {
            conn.query('INSERT INTO `like` (user_id, post_id) values ((SELECT id FROM user WHERE user_id = ?), (SELECT id FROM post WHERE pic = ?))', [id, pic], (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    conn.query('SELECT u.user_id FROM user AS u LEFT JOIN post AS p ON p.user_id = u.id WHERE p.pic = ?', [pic], (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let p_id = JSON.parse(JSON.stringify(results))[0].user_id;

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: '42sv.camagru@gmail.com',
                                pass: '*******'
                            }
                        });
                        const mailOptions = {
                            from: '42sv.camagru@gmail.com',
                            to: p_id,
                            subject: 'Please confirm this for camagru )',
                            html: "<a>" + id + " likes your picture</a>"
                        };
                    
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            }
                        });
                        res.json(results);
                    }
                })}
            })}
        }) 
    } else {
        res.json(11);
    }
})

app.post('/view_comment', (req, res) => {
    let pic = req.body.pic;

    conn.query('SELECT display FROM post WHERE pic = ?', [pic], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0].display === 0) {
                conn.query('UPDATE post SET display = 1 WHERE pic = ?', [pic], (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(results);
                    }
                })
            } else {
                conn.query('UPDATE post SET display = 0 WHERE pic = ?', [pic], (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(results);
                    }
                })
            }
        }
    })
    
})

app.post('/albumSet', (req, res) => {
    conn.query('UPDATE post SET display = 0', (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    })
})

app.post('/comment_push', (req, res) => {
    let text = req.body.text;
    let user = req.body.user;
    let pic = req.body.pic;

    if (req.session.userId !== undefined) {
        conn.query('INSERT INTO comment (user_id, post_id, text) values ((SELECT id FROM user WHERE user_id = ?), (SELECT id FROM post WHERE pic = ?), ?)', [user, pic, text], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                conn.query('SELECT u.user_id FROM user AS u LEFT JOIN post AS p ON p.user_id = u.id WHERE p.pic = ?', [pic], (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    let p_id = JSON.parse(JSON.stringify(results))[0].user_id;

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: '42sv.camagru@gmail.com',
                            pass: '*******'
                        }
                    });
                    const mailOptions = {
                        from: '42sv.camagru@gmail.com',
                        to: p_id,
                        subject: 'Please confirm this for camagru )',
                        html: "<a>" + user + " commented your picture</a>"
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        }
                    });
                    res.json(results);
                }
            })}
        })
    } else {
        res.json(11);
    }
})

app.post('/display_comment', (req, res) => {
    let pic = req.body.pic;

    conn.query('SELECT name, text, u.user_id, c.id AS u FROM comment AS c LEFT JOIN user AS u ON c.user_id = u.id WHERE post_id = (SELECT id FROM post WHERE pic = ?)', [pic], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json(results);
        }
    })
})

app.post('/forgot', (req, res) => {
    let id = req.body.id;
    let pwd = uuid();

    conn.query('SELECT * FROM user WHERE user_id = ?', [id], (err, results) => {
        if (err) {
            console.log(err);
        } else if (results.length === 0) {
            res.json(false);
        } else (
            conn.query('UPDATE user SET pwd = SHA1(?) WHERE user_id = ?', [pwd, id], (err) => {
                if (err) {
                    console.log(err);
                } else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: '42sv.camagru@gmail.com',
                            pass: '*******'
                        }
                    });
                
                    const mailOptions = {
                        from: '42sv.camagru@gmail.com',
                        to: id,
                        subject: 'Please confirm this for camagru )',
                        html: "<div>Your password is changed !<p>Pwd : " + pwd + "<p>You can change your pwd after login.</div>"
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        }
                    });
                    res.json(true);
                }
            })
        )
    }) 
})

app.post('/com_del', (req, res) => {
    let id = req.body.nb;

    conn.query('DELETE FROM comment WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    })
})

https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
    passphrase: '*******'
  }, app).listen(8443, () => console.log("hello"))
