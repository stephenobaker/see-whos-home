import React, { Component} from "react";
import {hot} from "react-hot-loader";
import "./App.css";



//import "./login.js";

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');


firebase.initializeApp({
  apiKey: "AIzaSyA3aZhoexP5H34RieRCDBweQzX8sh0FVaU",
  authDomain: "see-whos-home.firebaseapp.com",
  databaseURL: "https://see-whos-home.firebaseio.com",
  projectId: "see-whos-home",
  storageBucket: "see-whos-home.appspot.com",
  messagingSenderId: "387834386778",
  appId: "1:387834386778:web:531910cc4e358641"
});


var provider = new firebase.auth.GoogleAuthProvider();


function signIn() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
};

function signOut() {
	firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    	console.log(user.displayName);
    	console.log(user.uid);

  } else {
    // No user is signed in.
    console.log('user is signed out');
  }
});




//////


function NavigationBar(props) {
	return(
		<nav className="nav-bar">
			<Logo />
			<SignInButton />
			<SignOutButton />
		</nav>
	);
}

function SignInButton(props) {
	return <button className="button" onClick={signIn}>Sign In</button>
}

function SignOutButton(props) {
	return <button className="button red" onClick={signOut} />
}

function Logo(props) {
	return <div className="logo">Who's Home?</div>
}

function App() {
  return(
    <div className="app-global">
      <NavigationBar />
    </div>
  );
}

export default hot(module)(App);