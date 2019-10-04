const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(bodyParser.json());

app.post('/signin', (req, res) => {
    if(req.body.id === 'kilkim' && req.body.pwd === '123') {
        res.json(1);
    } else {
        res.json(0);
    }
});

app.listen(8080, () => console.log("hello"));