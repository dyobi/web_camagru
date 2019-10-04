import React from 'react';
import './index.css';

function BodyAlbum () {
    return (
        <div className="body-album">
            <div className="body-album-part">
                <div className="body-album-each-left">
                    <div className="body-album-pic" />
                    <div className="body-album-comment" />
                </div>
                <div className="body-album-each-right">
                    <div className="body-album-pic" />
                    <div className="body-album-comment" />
                </div>
                <div className="body-album-each-left">
                    <div className="body-album-pic" />
                    <div className="body-album-comment" />
                </div>
                <div className="body-album-each-right">
                    <div className="body-album-pic" />
                    <div className="body-album-comment" />
                </div>
            </div>
        </div>
    );
}

export default BodyAlbum;