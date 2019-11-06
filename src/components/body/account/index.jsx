import React from 'react';
import { useDispatch } from 'react-redux';
import { ui_nav, acc_signin, acc_signup, acc_user, acc_mail } from '../../../actions';
import './index.css';

import axios from 'axios';

function BodyAccount () {
    const dispatch = useDispatch();

    function handleform() {
        
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
        if (fn_pw_check(document.signup.pwd.value, document.signup.repwd.value, document.signup.id.value) === true) {
            axios.post('/signup', {
                id: document.signup.id.value,
                pwd: document.signup.pwd.value,
                name: document.signup.name.value,
                pn: document.signup.pn.value
            })
            .then(res => {
                console.log(res);
                if (res.data) {
                    dispatch(acc_mail(document.signup.id.value.split('@')[1]));
                    dispatch(acc_signup(1));
                }
                else {
                    alert('E-mail has already existed !');
                }
            })
        }
    }

    function Valid_signup (e) {
        e.preventDefault();
        handleform();
    }

    function Valid_signin (e) {
        e.preventDefault();
        _handleTest();
    }

    function _handleTest() {
        axios.post('/signin', {
            id: document.signin.id.value,
            pwd: document.signin.pwd.value
        })
        .then(res => {
            if(res.data && res.data !== 11) {
                let id = document.signin.id.value;
                dispatch(acc_user(id));
                dispatch(acc_signin(1));
                dispatch(ui_nav(0));
            } else if (res.data === 11) {
                alert('Session is expired !');
                dispatch(ui_nav(3));
                dispatch(acc_user(''));
                dispatch(acc_signin(0));
            } else {
                alert('ID or password is wrong.');
            }
        });
    }

    function handle_forgot(e) {
        e.preventDefault();
        
        axios.post('/forgot', {
            id: document.forgot.id.value
        })
        .then(res => {
            if (res.data === false) {
                alert('E-mail is not exist !');
            } else {
                alert('Please confirm your e-mail !');
            }
        })
    }

    return (
        <div className="body-account">
            <div className="body-account-part">
                <div className="body-account-signin">
                    <form name="signin" onSubmit={Valid_signin}>
                        <div className="body-acc-idtext">E-MAIL :</div>
                        <input type="email" className="body-account-id" name="id" required/>
                        <div className="body-acc-pwdtext">PWD :</div>
                        <input type="password" className="body-account-pwd" name="pwd" required/>
                        <button className="body-acc-inup1">SIGN_IN_NOW</button>
                    </form>
                    <form name="forgot" onSubmit={handle_forgot}>
                    <div className="body-acc-idtext1">E-MAIL :</div>
                    <input type="email" className="body-account-id1" name="id" required/>
                    <button className="body-acc-inup2">FORGOT PASSWORD</button>
                    </form>
                </div>
                <div className="body-account-signup">
                    <form name="signup" onSubmit={Valid_signup}>
                        <div className="body-acc-idtext">E-MAIL :</div>
                        <input type="email" className="body-account-id" name="id" required/>
                        <div className="body-acc-nametext">NAME :</div>
                        <input type="text" className="body-account-name" name="name" required/>
                        <div className="body-acc-pwdtext">PWD :</div>
                        <input type="password" className="body-account-pwd" name="pwd" required/>
                        <div className="body-acc-repwdtext">RE_PWD :</div>
                        <input type="password" className="body-account-pwd" name="repwd" required/>
                        <div className="body-acc-pntext">P/N :</div>
                        <input type="text" className="body-account-pn" name="pn" required/>
                        <button className="body-acc-inup2">SIGN_UP_NOW</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BodyAccount;