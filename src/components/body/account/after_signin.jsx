import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { acc_change } from '../../../actions';
import './index.css';

function BodyAccU () {
    const dispatch = useDispatch();

    const change = useSelector(state => state.acc);

    function handle_change() {
        if(document.change.pwd.value === document.change.repwd.value) {
            return(1);
        } else {
            return(0);
        }
    }

    function Valid_change (e) {
        e.preventDefault();
        if (handle_change() === 1) {
            dispatch(acc_change(1));
            setTimeout(() => {
                dispatch(acc_change(0))
            }, 5000);
        } else {
            console.log('Fill out correctly !');
        }
    }

    return (
        <div className="body-account">
            <div className="body-account-part">
                {change.change_info === 0 ? <div className="body-acc-info-top" /> : <div className="body-acc-info-top-action">UPDATED PERFECTLY !</div>}
                <form name="change" onSubmit={Valid_change}>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-id">E-MAIL :</div>
                        <div className="body-acc-info-user">hi</div>
                    </div>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-text-pwd">PWD :</div>
                        <input type="password" className="body-acc-info-pwd" name="pwd" required/>
                    </div>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-text-repwd">RE_PWD :</div>
                        <input type="password" className="body-acc-info-pwd" name="repwd" required/>
                    </div>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-text-pn">P/N :</div>
                        <input type="text" className="body-acc-info-pn" />
                    </div>
                    <button className="body-acc-in-as">CHANGE_NOW</button>
                </form>
            </div>
        </div>
    );
}

export default BodyAccU;