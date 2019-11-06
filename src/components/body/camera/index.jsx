import React from 'react';
import Webcam from 'react-webcam';
import { IoIosRadioButtonOn, IoMdSend } from "react-icons/io";
import { FiFilm } from "react-icons/fi";
import { confirmAlert } from 'react-confirm-alert';
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { cam_arr, cam_curr, cam_filter, ui_nav, acc_user, acc_signin, cam_patch } from '../../../actions';
import './index.css';

import axios from 'axios';

function BodyCam () {
    const webcamRef = React.useRef(null);
    const dispatch = useDispatch();
    let cam = useSelector(state => state.cam);
    let acc = useSelector(state => state.acc);
    let absoluteX = 0;
	let absoluteY = 0;

    function Capture() {
        if (cam.arr === undefined) {
            dispatch(cam_arr(webcamRef.current.getScreenshot()));
        } else {
            dispatch(cam_arr(cam.arr.concat(webcamRef.current.getScreenshot())));
        }
    };

    function Temporary(cam, i) {
        let status = cam.curr;

        if (status === -1) {
            dispatch(cam_curr(i));
        } else if (status === i) {
            dispatch(cam_curr(-1));
            dispatch(cam_patch([]));
        } else {
            dispatch(cam_curr(i));
            dispatch(cam_patch([]));
        }
    }

    function Filter() {
        dispatch(cam_filter(cam.filter + 1))
        if (cam.filter === 2) {
            dispatch(cam_filter(-1));
        }
    }

    function SetFil() {
        if (cam.filter === 0) {
            return ("body-cam-fil1");
        } else if (cam.filter === 1) {
            return ("body-cam-fil2");
        } else if (cam.filter === 2) {
            return ("body-cam-fil3");
        }
    }

    function Submit() {
        if (acc.user === '') {
            alert('Log in first !');
            dispatch(ui_nav(3));
        }
        else if (cam.arr.length === 0) {
            alert('Take pictures first !');
        }
        else if (cam.curr === -1) {
            alert('Choose one picture !');
        }
        else {
            let stickers = [];
			for(let i = 0; i < cam.patch.length; i++) {
				let target = document.getElementById('stickers-' + i);
				stickers.push({
					name: cam.patch[i],
					x: parseInt(target.style.left) / parseInt(document.getElementById('preview').offsetWidth),
					y: parseInt(target.style.top) / parseInt(document.getElementById('preview').offsetHeight)
                });
            }
            axios.post('/submit', {
                explain: document.getElementById('comment').textContent,
                user: acc.user,
                pic: cam.arr[cam.curr],
                filter: cam.filter,
                sticker: stickers
            })
            .then(res => {
                document.getElementById('comment').textContent = '';
                if (res.data !== 11) {
                    alert('Successfully posted !');
                    dispatch(cam_arr([]));
                    dispatch(cam_curr(-1));
                    dispatch(cam_patch([]));
                } else {
                    alert('Session is expired !');
                    dispatch(ui_nav(3));
                    dispatch(acc_user(''));
                    dispatch(acc_signin(0));
                }
            })
        }
    }

    const _handleFileUpload = () => {
		let input = document.getElementById('file');
		let extension = input.value.split('.')[input.value.split('.').length - 1];
		if(extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
			let file = input.files[0];
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
                dispatch(cam_arr(cam.arr.concat(reader.result)));
			}
		} else {
			input.value = '';
			confirmAlert({
				message: 'Extension of image can be only .jpg, .jpeg, .png!',
				buttons: [
					{
						label: 'Okay'
					}
				]
			});
		}
    }
    
    function _handleSticker(e) {
        dispatch(cam_patch(cam.patch.concat(e)));
    }

    function _handleDrag(e) {
        absoluteX = !absoluteX ? e.clientX : absoluteX;
		absoluteY = !absoluteY ? e.clientY + document.getElementById('camera').scrollTop : absoluteY;
		e.target.style.left = e.clientX - absoluteX + 'px';
		e.target.style.top = e.clientY - absoluteY + document.getElementById('camera').scrollTop + 'px';
    }

    document.addEventListener("dragover", function(event) {
		event.preventDefault();
    }, false);
    
    function _delSticker() {
        dispatch(cam_patch([]));
    }

    return (
        <div id="camera" className="body-cam">
            <div className="body-cam-part">
                <div id="preview" className="body-cam-contain">
                    {cam.curr === -1 ? <Webcam className="body-cam-camera" ref={webcamRef} screenshotFormat='image/jpeg' /> : ''}
                    {cam.curr !== -1 ? 
                        <div className="body-cam-camera-s">
                            {cam.patch.map((p, u) => <div id={'stickers-' + u} className="sticker-patch" draggable="true" onDrag={_handleDrag} onDoubleClick={() => _delSticker()} style={{backgroundImage: 'url(\'/stickers/' + p + '\')'}} key={u} alt="" />)}
                        </div>
                     : '' }
                    {cam.curr !== -1 && cam.filter === -1 ? <img className="body-cam-camera" src={cam.arr[cam.curr]} alt="" /> : ''}
                    {cam.curr !== -1 && cam.filter !== -1 ? <img className={`${SetFil()} body-cam-camera`} src={cam.arr[cam.curr]} alt="" /> : ''}
                    {cam.curr !== -1 ? <FiFilm className="body-cam-filter" onClick={() => Filter()}/> : '' }
                    <FiUpload className='file' onClick={ () => document.getElementById('file').click() } />	
					<input id='file' type='file' onChange={ () => _handleFileUpload() } style={{ display: 'none'}}></input>
                    <IoIosRadioButtonOn className="body-cam-shot" onClick={() => {cam.curr === -1 ? Capture() : dispatch(cam_curr(-1))}} />
                </div>
                <div className="body-cam-preview">
                {cam.arr.map((pic, i) => <img className={i === cam.curr ? `${SetFil()} body-cam-pre-one-action` : "body-cam-pre-one"} 
                key={i} src={pic} alt="" onClick={() => Temporary(cam, i)} />)}
                </div>
                {cam.curr !== -1 ? 
                    <div className="sticker-container">
                        {cam.sticker.map((cont, idx) => <div className="sticker-array" style={{backgroundImage: 'url(\'/stickers/' + cont + '\')'}} key={idx} alt="" 
                        onClick={() => _handleSticker(cont)} />)}
                    </div>
                 : ''}
                <div type="text" className="body-cam-comment" contentEditable="true" id="comment" />
                <IoMdSend className="body-cam-choose" onClick={() => Submit()}/>
            </div>
        </div>
    );
}

export default BodyCam;