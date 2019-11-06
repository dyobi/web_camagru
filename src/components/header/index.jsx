import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ui_nav, album_arr, cam_arr, cam_curr, cam_filter, cam_sticker } from '../../actions';

import axios from 'axios';

import './index.css';

function Header() {
    const dispatch = useDispatch();
    let acc = useSelector(state => state.acc);

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
                dispatch(ui_nav(2));
            });
        });
    }

    function _handle_cam() {
        axios.post('/get_sticker', {})
        .then(res => {
            dispatch(cam_sticker(res.data));
            dispatch(cam_arr([]));
            dispatch(ui_nav(1));
            dispatch(cam_curr(-1));
            dispatch(cam_filter(-1));
        })
    }

    function _albumSet() {
        axios.post('/albumSet', {})
        .then(res => {
            _handleAlbum();
        })
    }

	return (
		<div className="header">
            <div className="header-top">
                <div className="header-home menu" onClick={() => dispatch(ui_nav(0))}>HOME</div>
                <div className="header-camera menu" onClick={() => _handle_cam()}>CAMERA</div>
                <div className="header-album menu" onClick={() => _albumSet()}>ALBUM</div>
                {acc.signin === 0 ? <div className="header-account menu" onClick={() => dispatch(ui_nav(3))}>ACCOUNT</div> :
            <div className="header-account menu" onClick={() => dispatch(ui_nav(3))}>USER_INFO</div>}
            </div>
            <div className="header-bottom" />
        </div>
	);
}

export default Header;