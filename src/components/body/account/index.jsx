import React from 'react';
import { useDispatch } from 'react-redux';
import { ui_nav, acc_signin, acc_signup } from '../../../actions';
import './index.css';

import axios from 'axios';
import { URL } from '../../../const';

function BodyAccount () {
    const dispatch = useDispatch();

    function handleform() {
        if(document.signup.pwd.value === document.signup.repwd.value) {
            return(1);
        } else {
            return(0);
        }
    }

    function Valid_signup (e) {
        e.preventDefault();
        if (handleform() === 1) {
            dispatch(acc_signup(1));
        } else {
            console.log('Fill out correctly !');
        }
    }

    function Valid_signin (e) {
        e.preventDefault();
        _handleTest();
    }

    function _handleTest() {
        axios.post(URL + 'signin', {
            id: document.signin.id.value,
            pwd: document.signin.pwd.value
        })
        .then(res => {
            if(res.data === 1) {
                dispatch(acc_signin(1));
                dispatch(ui_nav(0));
            } else {
                alert('password is wrong');
            }
        });
    }

    return (
        <div className="body-account">
            <div className="body-account-part">
                <div className="body-account-signin">
                    <form name="signin" onSubmit={Valid_signin}>
                        <div className="body-acc-idtext">E-MAIL :</div>
                        <input type="text" className="body-account-id" name="id" required/>
                        <div className="body-acc-pwdtext">PWD :</div>
                        <input type="password" className="body-account-pwd" name="pwd" required/>
                        <button className="body-acc-inup">SIGN_IN_NOW</button>
                    </form>
                </div>
                <div className="body-account-signup">
                    <form name="signup" onSubmit={Valid_signup}>
                        <div className="body-acc-idtext">E-MAIL :</div>
                        <input type="text" className="body-account-id" required/>
                        <div className="body-acc-pwdtext">PWD :</div>
                        <input type="password" className="body-account-pwd" name="pwd" required/>
                        <div className="body-acc-repwdtext">RE_PWD :</div>
                        <input type="password" className="body-account-pwd" name="repwd" required/>
                        <div className="body-acc-pntext">P/N :</div>
                        <input type="text" className="body-account-pn" required/>
                        <button className="body-acc-inup">SIGN_UP_NOW</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BodyAccount;