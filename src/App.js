import React from 'react';
import { useSelector } from 'react-redux';

import Header from './components/header';
import BodyHome from './components/body/home';
import BodyCam from './components/body/camera';
import BodyAlbum from './components/body/album';
import BodyAccount from './components/body/account';
import BodyAccAs from './components/body/account/after_signup.jsx';
import BodyAccU from './components/body/account/after_signin.jsx';
import axios from 'axios';
import { URL } from './const';

import './App.css';

function App() {
  let ui = useSelector(state => state.ui);
  let acc = useSelector(state => state.acc);

  //const dispatch = useDispatch();
  // function _handleTest() {
  //   axios.post(URL + 'api/signin', {
  //     name: 'aidan',
  //     password: '123',
  //   })
  //   .then(res => {
  //     if(res.data === 1) {
  //       dispatch(acc_signin(1));
  //     } else {
  //       alert('password is wrong');
  //     }
  //   });
  // }

  return (
    <div className="App no-drag">
      <Header />
      {ui.nav === 0 ? <BodyHome /> : ''}
      {ui.nav === 1 ? <BodyCam /> : ''}
      {ui.nav === 2 ? <BodyAlbum /> : ''}
      {ui.nav === 3 && acc.signup === 0 && acc.signin === 0 ? <BodyAccount /> : ''}
      {ui.nav === 3 && acc.signup === 1 && acc.signin === 0 ? <BodyAccAs /> : ''}
      {ui.nav === 3 && acc.signin === 1 ? <BodyAccU /> : ''}
    </div>
  );
}

export default App;