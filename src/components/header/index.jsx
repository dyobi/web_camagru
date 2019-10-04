import React from 'react';
import { useDispatch } from 'react-redux';
import { ui_nav } from '../../actions';
import { useSelector } from 'react-redux';

import './index.css';

function Header() {
    const dispatch = useDispatch();
    let acc = useSelector(state => state.acc);

	return (
		<div className="header">
            <div className="header-top">
                <div className="header-home menu" onClick={() => dispatch(ui_nav(0))}>HOME</div>
                <div className="header-camera menu" onClick={() => dispatch(ui_nav(1))}>CAMERA</div>
                <div className="header-album menu" onClick={() => dispatch(ui_nav(2))}>ALBUM</div>
                {acc.signin === 0 ? <div className="header-account menu" onClick={() => dispatch(ui_nav(3))}>ACCOUNT</div> :
            <div className="header-account menu" onClick={() => dispatch(ui_nav(3))}>USER_INFO</div>}
            </div>
            <div className="header-bottom" />
        </div>
	);
}


export default Header;