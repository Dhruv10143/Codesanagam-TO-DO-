import React, { useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, set } from 'firebase/database';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import './Authen.css';
import Img8 from './images/login_bg.webp';
import { useNavigate} from 'react-router-dom';

const cors = require('cors');
const firebaseConfig = {
  apiKey: "AIzaSyC37RRKljstYPMqdh-aPaX4EfKTiBkRrrs",
  authDomain: "project-1-5df26.firebaseapp.com",
  databaseURL: "https://project-1-5df26-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-1-5df26",
  storageBucket: "project-1-5df26.appspot.com",
  messagingSenderId: "997749858697",
  appId: "1:997749858697:web:c46ca304df75d7a0f2c158",
  measurementId: "G-HR1J9054LL"
  // Your firebase config here
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const analytics = getAnalytics(firebase);

const Authen = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [err, setErr] = useState('Enter your Username and password to login');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      var lout = document.getElementById('logout');
      lout.classList.add('hide');
      setErr('You have been successfully logged out');
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const login = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log(email, password);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        var lout = document.getElementById('logout');
        lout.classList.remove('hide');
        setErr(`Welcome ${user.email}`);
        navigate('/Signup')
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
        setErr(errorMessage);
      });
  };

  const signup = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log(email, password);
    const db = getDatabase(firebase);
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        var err = "Welcome" + user.email;
        setErr(err);
        console.log(err)
  
        set(ref(db, "Users/" + user.uid), {
          email: user.email,
        });
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setErr(errorMessage);
      });
  };

  const logout = () => {
    handleSignOut();
  };

  const google = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const db = getDatabase(firebase);
        console.log(user);
        set(ref(db, 'Users/' + user.uid), {
          email: user.email,
          name: user.displayName,
        });
        var lout = document.getElementById('logout');
        lout.classList.remove('hide');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div className="main">
      <div className="bg2">
        <div className="sign-in">
          <h1 className="page">Sign In</h1>
          <div className="input-grp">
            <span className="icon"></span>
            <input className="button" id="email" ref={emailRef} type="email" placeholder="Enter Your email" />
          </div>
          <div className="input-grp">
            <span className="icon"></span>
            <input className="button" id="password" ref={passwordRef} type="password" placeholder="Enter Your password" />
          </div>
        </div>

        <div className="login-div">
          <button id="signin-button" onClick={login}>
            Log in
          </button>
        </div>

        <p>{err}</p>

        <button id="logout" className="hide" onClick={logout}>
          Log out
        </button>
        <button id="google" className="google" onClick={google}>
          Sign in using Google
        </button>
        <br />
      </div>

      <div id="heading">Make sure your work gets done on time!</div>
      <button id="signup-button" onClick={signup}>
        Sign up
      </button>

      <img className="bg" src={Img8} alt="not yet found" />
    </div>
  );
};

export default Authen;
