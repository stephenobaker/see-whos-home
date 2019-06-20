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




function WaitingMessage(props) {
	if (props.isWaiting) {
		return <div className="p-2">{props.message}</div>;
	} else {
		return null;
	}
}

function UserPicture(props) {
	if (props.isLoggedIn) {
		return <img className="user-picture m-2" src={props.isLoggedIn.photoURL} />;
	} else {
		return null;
	}
}

function UserWelcome(props) {
	if (props.isLoggedIn) {
		return <div className="m-2">Welcome, {props.isLoggedIn.displayName}!</div>;
	} else {
		return null;
	}
}

function NavButton(props) {
	return <button className="button m-2" onClick={props.buttonAction}>{props.buttonName}</button>;
}

function SignInButtonSpan(props) {
	if (!props.isWaiting) {
		if (!props.isLoggedIn) {
			return <NavButton buttonAction={props.signIn} buttonName='Sign in with Google' />;
		} else {
			return <NavButton buttonAction={props.signOut} buttonName='Sign out' />;
		}		
	} else {
		return null;
	}
}


function NavigationBar(props) {
	const isWaiting = props.isWaiting;
	const isLoggedIn = props.isLoggedIn;
	const signIn = props.signIn;
	const signOut = props.signOut;

	return (
		<nav className="nav-bar row d-flex align-items-center justify-content-center justify-content-md-between flex-column flex-md-row">
			<div className="logo align-items-center col-auto mr-md-auto">Who's at the Market?</div>
			<WaitingMessage isWaiting={isWaiting} message='Waiting...' />
			<UserWelcome isLoggedIn={isLoggedIn} />
			<UserPicture isLoggedIn={isLoggedIn} />
			<SignInButtonSpan isWaiting={isWaiting} isLoggedIn={isLoggedIn} signIn={signIn} signOut={signOut} />			
		</nav>
	);
}


function PublicMarketTable(props) {
	if (!props.isLoggedIn) {
		return <div>Public Market Display Table will go here</div>
	} else {
		return null;
	}

}


function MarketsManaged(props) {
	return <div>MarketsManaged</div>;
}


function CreateMarketForm(props) {
	return (
		<div>CreateMarketForm</div>
	);
}


function MarketsJoined(props) {
	return <div>MarketsJoined</div>;
}


function JoinMarketForm(props) {
	return <div>JoinMarketForm</div>;
}



class TwoViewCycle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isFirstCycle: true};
		this.handleForward = this.handleForward.bind(this);
		this.handleBackward = this.handleBackward.bind(this);
	}
	
	handleForward() {
		this.setState({isFirstCycle: false});
	}
	
	handleBackward() {
		this.setState({isFirstCycle: true});
	}
	
	render() {
		const isFirstCycle = this.state.isFirstCycle;
		const tabIsLive = this.props.tabIsLive;

		if (tabIsLive) {
			if (isFirstCycle) {
				return (
					<div className="tab bottom row justify-content-center align-items-center">
						<div className='col-12 d-flex justify-content-center'>
							{this.props.firstComponent}
						</div>
						<div className='col-12 d-flex justify-content-center'>	
							<button className = "button m-4" onClick={this.handleForward}>{this.props.createText}</button>
						</div>						
					</div>
				);	
			} else {
				return (
					<div className="tab bottom row justify-content-center align-items-center">
						<div className='col-12 d-flex justify-content-center'>
							{this.props.secondComponent}
						</div>
						<div className='col-12 d-flex justify-content-center'>
							<button className = "button m-4" onClick={this.handleBackward}>Go back</button>
						</div>
					</div>
				);
			}			
		} else {
			return null;
		}
	}
}






class TabbedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isFirstTab: true};
		this.goFirstTab = this.goFirstTab.bind(this);
		this.goSecondTab = this.goSecondTab.bind(this);
	}

	goFirstTab() {
		this.setState({isFirstTab: true});
	}

	goSecondTab() {
		this.setState({isFirstTab: false});
	}

	render() {
		const isFirstTab = this.state.isFirstTab;
		const isLoggedIn = this.props.isLoggedIn;

		if (isLoggedIn) {
			return (
				<div className="p-2 p-sm-4 console-container">	
					<div className="row flex-row">
						<button className={`tab ${isFirstTab ? 'live' : 'dead'} col-6 d-flex justify-content-center align-items-center`} onClick={this.goFirstTab}>
							Markets you manage
						</button>
						<button className={`tab ${isFirstTab ? 'dead' : 'live'} col-6 d-flex justify-content-center align-items-center`} onClick={this.goSecondTab}>
							Markets you sell at
						</button>
					</div>
					<TwoViewCycle
						createText='Create New Market'
						tabIsLive={isFirstTab ? true : false}
						firstComponent={<MarketsManaged />}
						secondComponent={<CreateMarketForm />}
					/>
					<TwoViewCycle
						createText='Join A Market'
						tabIsLive={isFirstTab ? false : true}
						firstComponent={<MarketsJoined />}
						secondComponent={<JoinMarketForm />}
					/>
				</div>
			);
		} else {
			return null;
		}	
	}
}







class FirebaseLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authUser: null,
			waiting: true
		};
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
		this.setState({waiting: true})
	}

	signOut() {
		firebase.auth().signOut();
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					authUser: user,
					waiting: null
				});
			} else {
				this.setState({
					authUser: null,
					waiting: null
				});
			}
		});
	}

	render() {
		const isWaiting = this.state.waiting;
		const isLoggedIn = this.state.authUser;
		


		return (
			<div className="container-fluid app-global">
				<NavigationBar isWaiting={isWaiting} isLoggedIn={isLoggedIn} signIn={this.signIn} signOut={this.signOut}/>
				<TabbedContainer isLoggedIn={isLoggedIn} />
				<PublicMarketTable isLoggedIn={isLoggedIn} />
    		</div>
		);


	}
}







//TODO: This will eventualy just have FirebaseLogin component, (or rather FirebaseLogin will be renamed App and replace this as a class declaration)


function App() {
  return <FirebaseLogin />;
}

export default hot(module)(App);