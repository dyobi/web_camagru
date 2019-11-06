import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoComment, GoHeart } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { album_arr, ui_nav, album_view_id, acc_user, acc_signin } from '../../../actions';
import { IoIosAddCircleOutline } from "react-icons/io";
// import { isMobile } from "react-device-detect";

import './index.css';

import axios from 'axios';

function BodyAlbum () {
    const dispatch = useDispatch();
    let album = useSelector(state => state.album);
    let acc = useSelector(state => state.acc);

    function One_del (e) {
        axios.post('/pic_del', {
            pic: e,
            user: acc.user
        })
        .then(res => {
            if (res.data === 11) {
                alert('Session is expired !');
                dispatch(ui_nav(3));
                dispatch(acc_user(''));
                dispatch(acc_signin(0));
            } else if (res.data) {
                alert('Successfully Deleted !');
                _handleAlbum();
            }
            else {
                alert('You are not allowed to delete this pic !');
            }
        })
    }

    function _handleAlbum() {
        axios.post('/picture', {
            user: acc.user
        })
        .then(res => {
            let temp = res.data;
            const promises = temp.map((each, index) => {
                return axios.post('/display_comment', {
                        pic: each.pic
                    })
                    .then(res2 => {
                        const tmp = {
                            comments: res2.data
                        }
                        temp[index] = Object.assign(each, tmp);
                    });
            });
            Promise.all(promises).then(() => {
                dispatch(album_arr(temp));
            });
        });
    }

    function _like(e) {
        if (acc.user !== '') {
            axios.post('/like', {
                id: acc.user,
                pic: e
            })
            .then(res => {
                if (res.data !== 11) {
                    _handleAlbum();
                } else {
                    alert('Session is expired !');
                    dispatch(ui_nav(3));
                    dispatch(acc_user(''));
                    dispatch(acc_signin(0));
                }
            })
        }
        else {
            alert('Log in first !');
            dispatch(ui_nav(3));
        }
    }

    function _comment(index) {
        if (album.view_id === index) {
            dispatch(album_view_id(-1));
        } else {
            dispatch(album_view_id(index));
        }
    }

    function Comment_push(e) {
        if (acc.user === '') {
            alert('Log in first !');
            dispatch(ui_nav(3));
        } else if (document.getElementById('post_comment').textContent === '') {
            console.log('Nothing')
        } else {
            axios.post('/comment_push', {
                text: document.getElementById('post_comment').textContent,
                user: acc.user,
                pic: e
            })
            .then(res => {
                if (res.data !== 11) {
                    document.getElementById('post_comment').textContent = '';
                    _handleAlbum();
                } else {
                    alert('Session is expired !');
                    dispatch(ui_nav(3));
                    dispatch(acc_user(''));
                    dispatch(acc_signin(0));
                }
            })
        }
    }

    function Com_del(idx, id, index, nb) {
        if (acc.user === id) {
            axios.post('/com_del', {
                nb: nb
            })
            .then(res => {
                let temp = album.arr[index].comments.splice(idx, 1);
                let arrr = album.arr;

                arrr[index].comments = temp;
                dispatch(album_arr(arrr));
                _handleAlbum();
                alert('Deleted successfully !');
            })
        } else {
            alert('Permission is denied !');
        }
    }

    return (
        <div className="body-album">
            <div className="body-album-part">
                { album.arr.map((each, index) =>
                    <div className="body-album-each" key={index} >
                        {each.filter === -1 ? <div className="body-album-pic" style={{ backgroundImage: 'url(\'data:image/jpeg;base64,' + each.temp + '\')' }} /> : ''}
                        {each.filter === 0 ? <div className="body-album-pic1" style={{ backgroundImage: 'url(\'data:image/jpeg;base64,' + each.temp + '\')' }} /> : ''}
                        {each.filter === 1 ? <div className="body-album-pic2" style={{ backgroundImage: 'url(\'data:image/jpeg;base64,' + each.temp + '\')' }} /> : ''}
                        {each.filter === 2 ? <div className="body-album-pic3" style={{ backgroundImage: 'url(\'data:image/jpeg;base64,' + each.temp + '\')' }} /> : ''}
                        {each.is_like === null ? <GoHeart className="body-album-ft-1" onClick={() => _like(each.pic)} /> : <GoHeart className="body-album-ft-1-1" onClick={() => _like(each.pic)} />}
                        {each.display === 0 ? <GoComment className="body-album-ft-2" onClick={() => _comment(index)} /> : <GoComment className="body-album-ft-2-1" onClick={() => _comment(each.pic, index)} />}
                        <div className="body-album-postid">{each.name}</div>
                        <IoIosCloseCircleOutline className="body-album-ft2" onClick={() => One_del(each.pic)} />
                        <div className="count_like">{each.count} Likes</div>
                        <div className="count_comment">{each.count_text} Comments</div>
                        {each.display === 0 ? <div className="body-album-comment">{each.explain}</div> : ''}
                        {index === album.view_id ?
                            <div className="body-album-comment-1">
                                {each.count_text === 0 
                                    ? 
                                    <div className="ba-comment-top">No comments yet</div>
                                    :
                                    <div id={'ba-comment-top-' + index} className="ba-comment-top">
                                        {each.comments.map((contents, idx) => 
                                            <div key={idx}>
                                                <div className="each_comment">{contents.name} : {contents.text}</div>
                                                <IoIosCloseCircleOutline className="each_comment_del" onClick={() => Com_del(idx, contents.user_id, index, contents.u)}/>
                                            </div>
                                        )}
                                    </div>
                                }
                                <div type="text" className="ba-comment-btm" contentEditable="true" id="post_comment" />
                                <IoIosAddCircleOutline className="ba-comment-send" onClick={() => Comment_push(each.pic)} />
                            </div>
                        : '' }
                    </div>
                )} 
            </div>
        </div>
    );
}

export default BodyAlbum;