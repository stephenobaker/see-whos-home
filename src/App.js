import React, { Component} from "react";
import {hot} from "react-hot-loader";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";


var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

let marketsYouManage = false;

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
  //   document.querySelector('#signOut').classList.remove('d-none');
  //   document.querySelector('#signIn').classList.add('d-none')
  //   document.querySelector('#userWelcome').innerHTML = 'Hi, ' + user.displayName + '!';
  //   document.querySelector('#userWelcome').classList.add('d-sm-block');
  //   document.querySelector('#userPicture').setAttribute('src', user.photoURL);
  //   document.querySelector('#userPicture').classList.remove('d-none');
  //   document.querySelector('#tempWaitMsg').classList.add('d-none');
  console.log('user signed in');



  } else {
    // No user is signed in.
    // document.querySelector('#signIn').classList.remove('d-none');
    // document.querySelector('#signOut').classList.add('d-none')
    // document.querySelector('#userWelcome').classList.remove('d-sm-block');
    // document.querySelector('#userPicture').classList.add('d-none');
    // document.querySelector('#tempWaitMsg').classList.add('d-none');
    console.log('user signed out');
  }
});



function TestFirebaseAction() {
	return(
		<div>firebaseD</div>
	);
}








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
		firebase.auth().onAuthStateChanged(authUser => {
			authUser
				? this.setState({authUser})
				: this.setState({authUser: null});
		});
	}

	render() {
		if (this.state.authUser) {
			return (
				<button className="button m-2" id="signOut" onClick={this.signOut}>Sign Out</button>
			);
		} else {
			return (
				<button className="button m-2" id="signIn" onClick={this.signIn}>Sign In with Google</button>
			);
		}
		
	}
}







function NavigationBar(props) {
	return(
		//<div className="container-fluid">
		<nav className="nav-bar row d-flex align-items-center justify-content-center justify-content-sm-between flex-column flex-sm-row">
			<div className="logo d-flex align-items-center col-auto mr-sm-auto">Who's at the Market?</div>
			<div className="d-inline-flex align-items-center flex-column flex-sm-row">
				<div id="tempWaitMsg" className="m-2">Signing in...</div>
				<div className="d-none m-2" id="userWelcome"></div>
				<img className="d-none user-picture m-2" id="userPicture" src={''}/>
				<SignInButtons />
			</div>
		</nav>
		//</div>
	);
}



class RenderItems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hasItems: false};
	}

	componentDidMount() {

		if (marketsYouManage === true) {
			this.setState({hasItems: true});
		} else {
			this.setState({hasItems: false});
		}
	}

	render() {
		return(
			<div className="col-12 d-flex justify-content-center">
				{(this.state.hasItems === true) ? (
						<em>
							You do have items in a list!
						</em>
				) : (
						<em>
							It looks like you don't manage any markets. Would you like to create a new one?
						</em>
				)}
			</div>
		);
	}
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
						<RenderItems />
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