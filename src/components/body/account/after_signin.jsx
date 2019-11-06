import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { acc_change, acc_signin, acc_user, acc_signup, ui_nav } from '../../../actions';
import './index.css';

import axios from 'axios';

function BodyAccU () {
    const dispatch = useDispatch();

    const change = useSelector(state => state.acc);

    function fn_pw_check(pw, pw2, id) {

        let pw_passed = true;    
        let pattern1 = /[0-9]/;
        let pattern2 = /[a-zA-Z]/;
        let pattern3 = /[~!@#$%<>^&*]/;     // 원하는 특수문자 추가 제거

        if(pw !== pw2) {
                alert("Password doesn't match");
                return false;
        }
       if(!pattern1.test(pw)||!pattern2.test(pw)||!pattern3.test(pw)||pw.length<8||pw.length>50){
            alert("Password should contain [English, Digit, Special character, At least 8 char].");
            return false;
        }          
        if(pw.indexOf(id) > -1) {
            alert("Password should not contain id.");
            return false;
        }
        var SamePass_0 = 0; //동일문자 카운트
        var SamePass_1 = 0; //연속성(+) 카운드
        var SamePass_2 = 0; //연속성(-) 카운드
        for(var i=0; i < pw.length; i++) {
             var chr_pass_0;
             var chr_pass_1;
             var chr_pass_2;
             if(i >= 2) {
                 chr_pass_0 = pw.charCodeAt(i-2);
                 chr_pass_1 = pw.charCodeAt(i-1);
                 chr_pass_2 = pw.charCodeAt(i);
                  //동일문자 카운트
                 if((chr_pass_0 === chr_pass_1) && (chr_pass_1 === chr_pass_2)) {
                    SamePass_0++;
                  } 
                  else {
                   SamePass_0 = 0;
                   }
                  //연속성(+) 카운드
                 if(chr_pass_0 - chr_pass_1 === 1 && chr_pass_1 - chr_pass_2 === 1) {
                     SamePass_1++;
                  }
                  else {
                   SamePass_1 = 0;
                  }
                  //연속성(-) 카운드
                 if(chr_pass_0 - chr_pass_1 === -1 && chr_pass_1 - chr_pass_2 === -1) {
                     SamePass_2++;
                  } 
                  else {
                   SamePass_2 = 0;
                  }  
             }     
            if(SamePass_0 > 0) {
               alert("Password should not contain const 3 words or so.");
               pw_passed=false;
             } 
            if(SamePass_1 > 0 || SamePass_2 > 0 ) {
               alert("Password should not contain const 3 words or so.");
               pw_passed=false;
             }
                if(!pw_passed) {
                  return false;
            }
        }
        return true;
    }
    function handle_change() {
        let pwd = document.change.pwd.value;
        let repwd = document.change.repwd.value;

        if(pwd === repwd && fn_pw_check(pwd, repwd, change.user)) {
            return(1);
        } else {
            return(0);
        }
    }

    function Valid_change (e) {
        e.preventDefault();
        if (handle_change() === 1) {
            axios.post('/change', {
                id: change.user,
                pwd: document.change.pwd.value,
                pn: document.change.pn.value,
                name: document.change.name.value
            })
            .then(res => {
                if (res.data && res.data !== 11) {
                    dispatch(acc_change(1));
                    setTimeout(() => {
                        dispatch(acc_change(0))
                    }, 5000);
                } else if (res.data === 11) {
                    alert('Session is expired !');
                    dispatch(ui_nav(3));
                    dispatch(acc_user(''));
                    dispatch(acc_signin(0));
                }
            })
        }
    }

    function Del_user () {
        alert('Successfully Deleted !');
        axios.post('/delete', {
            id: change.user
        })
        .then(res => {
            if (res.data && res.data !== 11) {
                axios.post('/logout', {})
                dispatch(acc_user(''));
                dispatch(acc_signin(0));
                dispatch(acc_signup(0));
                dispatch(ui_nav(0));
            } else if (res.data === 11) {
                alert('Session is expired !');
                dispatch(ui_nav(3));
                dispatch(acc_user(''));
                dispatch(acc_signin(0));
            }
        })
    }

    function Log_out () {
        axios.post('/logout', {})
        .then(res => {
            alert('Successfully Logged Out !');
            dispatch(acc_user(''));
            dispatch(acc_signin(0));
            dispatch(acc_signup(0));
            dispatch(ui_nav(0));
        })  
    }

    return (
        <div className="body-account">
            <div className="body-account-part">
                {change.change_info === 0 ? <div className="body-acc-info-top" /> : <div className="body-acc-info-top-action">UPDATED PERFECTLY !</div>}
                <form name="change" onSubmit={Valid_change}>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-id">E-MAIL :</div>
                        <div className="body-acc-info-user">{change.user}</div>
                    </div>
                    <div className="body-acc-userinfo">
                        <div className="body-acc-info-name">NAME :</div>
                        <input type="text" className="body-acc-info-pwd" name="name" required/>
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
                        <input type="text" className="body-acc-info-pn" name="pn" />
                    </div>
                    <button className="body-acc-in-as">CHANGE_NOW</button>
                </form>
                <button className="body-acc-in-as" onClick={() => Log_out()}>LOG_OUT</button>
                <button className="body-acc-in-as" onClick={() => Del_user()}>DELETE_USER</button>
            </div>
        </div>
    );
}

export default BodyAccU;