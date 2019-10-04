import React from 'react';
import Webcam from 'react-webcam';
import { IoIosRadioButtonOn, IoMdSend } from "react-icons/io";
import { FiFilm } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { cam_arr, cam_curr, cam_filter } from '../../../actions';
import './index.css';

function BodyCam () {
    const webcamRef = React.useRef(null);
    const dispatch = useDispatch();
    let cam = useSelector(state => state.cam);

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
        } else {
            dispatch(cam_curr(i));
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

    return (
        <div className="body-cam">
            <div className="body-cam-part">
                <div className="body-cam-contain">
                    {cam.curr === -1 ? <Webcam className="body-cam-camera" ref={webcamRef} /> : ''}
                    {cam.curr !== -1 && cam.filter === -1 ? <img className="body-cam-camera" src={cam.arr[cam.curr]} alt="" /> : ''}
                    {cam.curr !== -1 && cam.filter !== -1 ? <img className={`${SetFil()} body-cam-camera`} src={cam.arr[cam.curr]} alt="" /> : ''}
                    {cam.curr !== -1 ? <FiFilm className="body-cam-filter" onClick={() => Filter()}/> : '' }
                    <IoIosRadioButtonOn className="body-cam-shot" onClick={() => {cam.curr === -1 ? Capture() : dispatch(cam_curr(-1))}} />
                </div>
                <div className="body-cam-preview">
                {cam.arr.map((pic, i) => <img className={i === cam.curr ? `${SetFil()} body-cam-pre-one-action` : "body-cam-pre-one"} 
                key={i} src={pic} alt="" onClick={() => Temporary(cam, i)} />)}
                </div>
                <div type="text" className="body-cam-comment" contentEditable="true" />
                <IoMdSend className="body-cam-choose" />
            </div>
        </div>
    );
}

export default BodyCam;