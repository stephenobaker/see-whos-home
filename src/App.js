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

var database = firebase.database();


class SignInButtons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {authUser: null};
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
	}
	signIn() {
		firebase.auth().signInWithRedirect(provider).then(function(result) {
		  var token = result.credential.accessToken;
		  var user = result.user;
		}).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  var email = error.email;
		  var credential = error.credential;
		});
	}
	signOut() {
		firebase.auth().signOut();
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
					this.setState({authUser: user});
					console.log('you signed in');
			} else {
					this.setState({authUser: null});
					console.log('you signed out');
			}
		});
	}
	render() {
		if(this.state.authUser) {
			return (
					<div className="d-inline-flex align-items-center flex-column flex-sm-row">
						<div className="d-flex m-2" id="userWelcome">Welcome, {firebase.auth().currentUser.displayName}!</div>
						<img className="d-flex user-picture m-2" id="userPicture" src={firebase.auth().currentUser.photoURL}/>
						<button className="d-flex button m-2" id="signOut" onClick={this.signOut}>Sign Out</button>
					</div>
			);
		}	else {
			return (
				<button className="d-flex button m-2" id="signIn" onClick={this.signIn}>Sign In with Google</button>
			);
		}
	}
}


function NavigationBar(props) {
	return(
		<nav className="nav-bar row d-flex align-items-center justify-content-center justify-content-sm-between flex-column flex-sm-row">
			<div className="logo d-flex align-items-center col-auto mr-sm-auto">Who's at the Market?</div>
			<SignInButtons />
		</nav>
	);
}


class CreateNewCycle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {firstCycle: true};
		this.handleForward = this.handleForward.bind(this);
		this.handleBackward = this.handleBackward.bind(this);
	}
	handleForward() {
		this.setState({firstCycle: false});
	}
	handleBackward() {
		this.setState({firstCycle: true});
	}
	render() {
		return(
				<div className="tab bottom row d-flex justify-content-center align-items-center">
				{this.state.firstCycle ? (
					<div>
						<div className="col-12 d-flex justify-content-center">
							<button className = "button" onClick={this.handleForward}>
								Create a new {this.props.buttonTitle}
							</button>
						</div>
					</div>
				) : (
					<div>
						<div className="col-12 d-flex justify-content-center">
							<button className = "button" onClick={this.handleBackward}>
								Go back.
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}


class TabbedContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div>
				<div className="p-2 p-sm-4 console-container">	
					<div className="row flex-row d-flex">
						<div className="tab live col-6 d-flex justify-content-center align-items-center">Markets you manage</div>
						<div className="tab dead col-6 d-flex justify-content-center align-items-center">Markets you sell at</div>
					</div>
					<CreateNewCycle buttonTitle='Market Space'/>
				</div>
			</div>
		);
	}
}


function App() {
  return(
    <div className="container-fluid app-global">
      <NavigationBar />
      <TabbedContainer />
      <div id='testFirebaseTarget'/>
    </div>
  );
}

export default hot(module)(App);