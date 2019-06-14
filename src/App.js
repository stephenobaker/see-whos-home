import React, { Component} from "react";
import {hot} from "react-hot-loader";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";


var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');


//For development only. This won't be needed when app is served via Firebase Hosting as custom URL's will be faster
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
	firebase.auth().signInWithRedirect(provider).then(function(result) {
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
	document.querySelector('#tempWaitMsg').classList.remove('d-none');

}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.querySelector('#signOut').classList.remove('d-none');
    document.querySelector('#signIn').classList.add('d-none')
    document.querySelector('#userWelcome').innerHTML = 'Hi, ' + user.displayName + '!';
    document.querySelector('#userWelcome').classList.add('d-sm-block');
    document.querySelector('#userPicture').setAttribute('src', user.photoURL);
    document.querySelector('#userPicture').classList.remove('d-none');
    document.querySelector('#tempWaitMsg').classList.add('d-none');




  } else {
    // No user is signed in.
    document.querySelector('#signIn').classList.remove('d-none');
    document.querySelector('#signOut').classList.add('d-none')
    document.querySelector('#userWelcome').classList.remove('d-sm-block');
    document.querySelector('#userPicture').classList.add('d-none');
    document.querySelector('#tempWaitMsg').classList.add('d-none');


  }
});


function NavigationBar(props) {
	return(
		<nav className="nav-bar d-flex align-items-center justify-content-center justify-content-sm-between flex-column flex-sm-row">
			<div className="logo d-flex align-items-center col-auto p-2 mr-sm-auto">Who's There?</div>
			<div className="d-inline-flex align-items-center flex-column flex-sm-row">
				<div id="tempWaitMsg" className="m-2">Signing in...</div>
				<div className="d-none m-2" id="userWelcome"></div>
				<img className="d-none user-picture m-2" id="userPicture" src={''}/>
				<button className="button d-none m-2" id="signIn" onClick={signIn}>Sign In with Google</button>
				<button className="button d-none m-2" id="signOut" onClick={signOut}>Sign Out</button>
			</div>
		</nav>
	);
}

/*function UserWindow(props) {
	return(
		<div>
			<div id="userWelcome"></div>
			<img id="userPicture" src={''}/>
		</div>
	);
}*/

function PublicList(props) {
		return <div />

}

function PrivateConsole(props) {
		return <div />

	
}












function App() {
  return(
    <div className="app-global">
      <NavigationBar />
    </div>
  );
}

export default hot(module)(App);