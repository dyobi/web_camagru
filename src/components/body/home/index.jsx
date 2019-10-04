import React from 'react';
import './index.css';

function BodyHome () {
    return (
        <div className="body-home">
            <div className="body-home-part body-home-pad1">
                <img className="body-home-img-left" src={require('../../../img/body1.jpeg')} alt="" />
                <div className="body-home-text1">Camagru is the first web project in 42</div>
            </div>
            <div className="body-home-part body-home-pad1">
                <img className="body-home-img-right" src={require('../../../img/body2.jpeg')} alt="" />
                <div className="body-home-text2"><p>Small web application allowing to make basic image</p>
                editing using webcam and some predefined images</div>
            </div>
            <div className="body-home-part body-home-pad2">
                <img className="body-home-img-left" src={require('../../../img/body3.jpeg')} alt="" />
                <div className="body-home-text3">By KILKIM</div>
            </div>
        </div>
    );
}

export default BodyHome;