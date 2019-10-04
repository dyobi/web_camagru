import React from 'react';
import { useDispatch } from 'react-redux';
import { ui_nav, acc_signin } from '../../../actions';
import './index.css';

function BodyAccAs () {
    const dispatch = useDispatch();

    function Valid_signin () {
        dispatch(ui_nav(0));
        dispatch(acc_signin(1));
    }

    return (

        <div className="body-account">
            <div className="body-account-part">
                <div className="accas-txt">WELCOME TO JOIN US : )</div>
                <form name="sign_in" onSubmit={Valid_signin}>
                    <div className="signin-form">
                        <div className="body-acc-idtext-as" name="id">E-MAIL :</div>
                        <input type="text" className="body-account-id-as" required/>
                        <div className="body-acc-pwdtext-as" name="pwd">PWD :</div>
                        <input type="password" className="body-account-pwd-as" required/>
                        <button className="body-acc-in-as">SIGN_IN_NOW</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BodyAccAs;