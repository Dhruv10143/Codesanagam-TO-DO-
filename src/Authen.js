import React, { Component } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth,signInWithEmailAndPassword, createUserWithEmailAndPassword ,onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
const cors=require('cors')
const firebaseConfig = {
  apiKey: "AIzaSyC37RRKljstYPMqdh-aPaX4EfKTiBkRrrs",
  authDomain: "project-1-5df26.firebaseapp.com",
  databaseURL: "https://project-1-5df26-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-1-5df26",
  storageBucket: "project-1-5df26.appspot.com",
  messagingSenderId: "997749858697",
  appId: "1:997749858697:web:bc2f51db30dffd63f2c158",
  measurementId: "G-SFFRMKHL7Q"
}; 

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const analytics = getAnalytics(firebase);
const handleSignOut = function () {
  const auth = getAuth(firebase);

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      var lout = document.getElementById('logout');
      lout.classList.add('hide');
      var err = "You have been successfully logged out";
      console.log(err);
      // Assuming 'this.setState' is being used within a React class component
      this.setState({ err: err });
    })
    .catch((error) => {
      // An error happened.
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};
class Authen extends Component {
    login(){
        const email=this.email.current.value
        const password=this.password.current.value
        console.log(email,password)
        const promise=signInWithEmailAndPassword(auth,email,password)
        promise.then((userCredential) => { 
        const user = userCredential.user;
        var lout=document.getElementById('logout');
        lout.classList.remove('hide');
        var err="Welcome"+user.email;
        this.setState({err:err})
  })
        promise.catch(error => {
            var err=error.message;
            console.log(err);
            this.setState({err: err});
        })
    }
    signup(){
        const email=this.email.current.value
        const password=this.password.current.value
        console.log(email,password)
        const db = getDatabase(firebase);
        const promise=createUserWithEmailAndPassword(auth, email, password)
        promise.then((userCredential) => { 
            const user = userCredential.user;
        var err="Welcome"+user.email;
        set(ref(db, "Users/" + user.uid),{
            email:user.email
          });
          console.log(user);
          this.setState({err:err});
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    this.setState({err:errorMessage})
    // ..
  });

        
    } 
    logout() {
      handleSignOut.call(this); // Call the handleSignOut method in the context of the component
    }
google(){
  const provider = new GoogleAuthProvider();
  const promise= signInWithPopup(auth, provider)
  promise.then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const db = getDatabase(firebase);
    console.log(user)
    set(ref(db, "Users/" + user.uid),{
      email:user.email,
      name: user.displayName
    });
    var lout=document.getElementById('logout');
    lout.classList.remove('hide');

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  promise.catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}
    constructor(props) {
      super(props)
      this.email=React.createRef()
      this.password=React.createRef()
      this.state = {
        err:'Enter you Username and password to login'
      };
          this.login=this.login.bind(this)  
          this.signup=this.signup.bind(this)  
          this.logout=this.logout.bind(this)
          this.google=this.google.bind(this)
    }
  render() {
    return (
      <div>
        <input id="email" ref={this.email}type="email" placeholder="Enter Your email" /><br />
        <input id="password" ref={this.password} type="password" placeholder="Enter Your password" /><br />
        <p>{this.state.err}</p>
        <button onClick={this.login}>Log in</button>
        <button onClick={this.signup}>Sign up</button>
        <button id="logout" className="hide" onClick={this.logout}>Log out</button>
        <button id="google" className="google" onClick={this.google}>Sign in using google</button><br />

       </div>
    )
  }
}
export default Authen
