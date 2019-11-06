import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ui_nav, acc_signin, acc_user } from '../../../actions';
import './index.css';

import axios from 'axios';

function BodyAccAs () {
    const dispatch = useDispatch();
    const acc = useSelector(state => state.acc);

    function Valid_signin (e) {
        e.preventDefault();
        _handleTest();
    }

    function _handleTest() {
        axios.post('/signin', {
            id: document.sign_in.id.value,
            pwd: document.sign_in.pwd.value
        })
        .then(res => {
            if(res.data && res.data !== 11) {
                let id = document.sign_in.id.value;
                dispatch(acc_signin(1));
                dispatch(ui_nav(0));
                dispatch(acc_user(id));
            } else if (res.data === 11) {
                alert('Session is expired !');
                dispatch(ui_nav(3));
                dispatch(acc_user(''));
                dispatch(acc_signin(0));
            } else {
                alert('ID or password information is wrong.');
            }
        });
    }

    return (

        <div className="body-account">
            <div className="body-account-part">
                <div className="accas-txt">WELCOME TO JOIN US : )</div>
                <a href={"https://www." + acc.mail} target="_blank;" style={{ textDecoration: 'none' }}><div className="accas-txt-1">CONFIRM YOUR E-MAIL AND SIGN IN !</div></a>
                <form name="sign_in" onSubmit={Valid_signin}>
                    <div className="signin-form">
                        <div className="body-acc-idtext-as">E-MAIL :</div>
                        <input type="text" className="body-account-id-as" name="id" required/>
                        <div className="body-acc-pwdtext-as">PWD :</div>
                        <input type="password" className="body-account-pwd-as"  name="pwd" required/>
                        <button className="body-acc-in-hi">SIGN_IN_NOW</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BodyAccAs;