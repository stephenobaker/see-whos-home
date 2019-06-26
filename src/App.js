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


class PublicMarketTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = ({
			loading: true,
			items: []
		});
	}

	componentDidMount() {

		const vendorsRef = this.props.database.ref('vendors');
		let newState = [];

		vendorsRef.on('child_added', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			newState.push({
				name: item.vendor_name,
				present: item.vendor_present,
				key: key
			});
			
			this.setState({
				items: newState,
				loading: false
			});
		});

		vendorsRef.on('child_changed', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			let newData = {
				name: item.vendor_name,
				present: item.vendor_present,
				key: key
			};
			
			for (var i = 0; i < newState.length; i++) {
				if (newState[i].key == key) {
					newState.splice(i, 1, newData);
				}
			}
			
			this.setState({
				items: newState,
				loading: false
			});
		});

		vendorsRef.on('child_removed', (snapshot) => {
			let key = snapshot.key;
			for (var i = 0; i < newState.length; i++) {
				if (newState[i].key == key) {
					newState.splice(i, 1);
				}
			}
			
			this.setState({
				items: newState,
				loading: false
			});
		});
	}

	componentWillUnmount() {
		this.props.database.ref('vendors').off();
	}

	render() {
		const publicOutput = this.state.items.map((item) =>
			<div key={item.key}>{item.name} is {item.present ? 'open' : 'not open'}</div>
		);


		return <div>{publicOutput}</div>
		
	}
}



class MarketItem extends React.Component {
	constructor(props) {
		super(props);

		this.handleDelete = this.handleDelete.bind(this);

	}

	/*componentDidMount() {
		
		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey + '/vendor_present');
		
		databaseRef.on('value', (snapshot) => {
			let isOpen = snapshot.val();			
			
			this.setState({
				isOpen: isOpen
			});

		});

	}*/

	/*handleOpen() {

		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey);
		
		databaseRef.update({
			vendor_present: true,
			user_id: this.props.authUser.uid
		});
	}

	handleClose() {

		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey);
		
		databaseRef.update({
			vendor_present: false,
			user_id: this.props.authUser.uid
		});
	}*/

	handleDelete() {
		const databaseRef = this.props.database.ref('markets/' + this.props.yourKey);
		databaseRef.remove();
	}

	render() {
		return (
			<div>
				{this.props.vendorName}
				<button onClick={this.handleDelete}>Click to delete</button>
			</div>
		);
	}
}





class MarketsManaged extends React.Component {
constructor(props) {
		super(props);

		this.state = ({
			loading: true,
			items: []
		});
	}

	componentDidMount() {
		const databaseRef = this.props.database.ref('markets');
		let newState = [];

		databaseRef.on('child_added', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			if (item.user_id === this.props.authUser.uid) {
				newState.push({
					name: item.vendor_name,
					key: key
				});
			}
			
			this.setState({
				items: newState,
				loading: false
			});
		});

		databaseRef.on('child_removed', (snapshot) => {
			let key = snapshot.key;
			for (var i = 0; i < newState.length; i++) {
				if (newState[i].key == key) {
					newState.splice(i, 1);
				}
			}
			
			this.setState({
				items: newState,
				loading: false
			});
		});
	}

	componentWillUnmount() {
		this.props.database.ref('markets').off();
	}

	render() {
		const divString = this.state.items.map((item) =>
			<MarketItem key={item.key} yourKey={item.key} vendorName={item.name} database={this.props.database} authUser={this.props.authUser} />
		);
		


	
		if (this.state.loading) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					{divString}
				</div>
			);
		}
	}
}


class CreateMarketForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		this.props.database.ref('markets').push().set({
			user_id: this.props.authUser.uid,
			vendor_name: this.state.value,
			vendor_present: false
		});
		event.preventDefault();
		this.setState({value: ''});
		this.props.goBack();
	}

	render() {
		const isLoggedIn = this.props.isLoggedIn;


		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Title of space:
						<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
					<input type="submit" value="Submit" />
					<button onClick={this.props.goBack}>Cancel</button>
				</form>
			</div>
		);
	}
}


class VendorItem extends React.Component {
	constructor(props) {
		super(props);

		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleDelete = this.handleDelete.bind(this);

		this.state = ({
			isOpen: false
		});
	}

	componentDidMount() {
		
		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey + '/vendor_present');
		
		databaseRef.on('value', (snapshot) => {
			let isOpen = snapshot.val();			
			
			this.setState({
				isOpen: isOpen
			});

		});

	}

	componentWillUnmount() {
		this.props.database.ref('vendors/' + this.props.yourKey + '/vendor_present').off();
	}

	handleOpen() {

		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey);
		
		databaseRef.update({
			vendor_present: true
		});
	}

	handleClose() {

		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey);
		
		databaseRef.update({
			vendor_present: false
		});
	}

	handleDelete() {
		const databaseRef = this.props.database.ref('vendors/' + this.props.yourKey);
		databaseRef.remove();
	}

	render() {
		return (
			<div>
				{this.props.vendorName} is {this.state.isOpen ? 'open' : 'not open'}.
				<button onClick={this.handleOpen}>Click to open</button>
				<button onClick={this.handleClose}>Click to close</button>
				<button onClick={this.handleDelete}>Delete</button>
			</div>
		);
	}
}




class VendorsManaged extends React.Component {
	constructor(props) {
		super(props);

		this.state = ({
			loading: true,
			items: []
		});
	}

	componentDidMount() {
		
		const databaseRef = this.props.database.ref('vendors');
		let newState = [];

		databaseRef.on('child_added', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			if (item.user_id === this.props.authUser.uid) {
				newState.push({
					name: item.vendor_name,
					key: key
				});
			}

			this.setState({
				items: newState,
				loading: false
			});

		});

		databaseRef.on('child_removed', (snapshot) => {
			let key = snapshot.key;
			for (var i = 0; i < newState.length; i++) {
				if (newState[i].key == key) {
					newState.splice(i, 1);
				}
			}
			
			this.setState({
				items: newState,
				loading: false
			});
		});		
	}

	componentWillUnmount() {
		this.props.database.ref('vendors').off();
	}

	render() {
		const divString = this.state.items.map((item) =>
			<VendorItem key={item.key} yourKey={item.key} vendorName={item.name} database={this.props.database} authUser={this.props.authUser} />
		);
		


	
		if (this.state.loading) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					{divString}
				</div>
			);
		}
	}
}


class CreateVendorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		this.props.database.ref('vendors').push().set({
			user_id: this.props.authUser.uid,
			vendor_name: this.state.value,
			vendor_present: false
		});
		event.preventDefault();
		this.setState({value: ''});
		this.props.goBack();
	}

	render() {
		const isLoggedIn = this.props.authUser;


		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Title of space:
						<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
					<input type="submit" value="Create" />
					<button onClick={this.props.goBack}>Cancel</button>
				</form>
			</div>
		);
	}
}





class MarketsCycle extends React.Component {
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
							<MarketsManaged authUser={this.props.isLoggedIn} database={this.props.database} />
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
							<CreateMarketForm authUser={this.props.isLoggedIn} database={this.props.database} goBack={this.handleBackward}/>
						</div>
					</div>
				);
			}			
		} else {
			return null;
		}
	}
}

class VendorsCycle extends React.Component {
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
							<VendorsManaged authUser={this.props.isLoggedIn} database={this.props.database} />
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
							<CreateVendorForm authUser={this.props.isLoggedIn} database={this.props.database} goBack={this.handleBackward}/>
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
							Markets you own
						</button>
						<button className={`tab ${isFirstTab ? 'dead' : 'live'} col-6 d-flex justify-content-center align-items-center`} onClick={this.goSecondTab}>
							Vendors you own
						</button>
					</div>
					<MarketsCycle
						createText='Create New Market'
						tabIsLive={isFirstTab ? true : false}
						isLoggedIn={isLoggedIn}
						database={this.props.database}
					/>
					<VendorsCycle
						createText='Create New Vendor'
						tabIsLive={isFirstTab ? false : true}
						isLoggedIn={isLoggedIn}
						database={this.props.database}
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
		firebase.auth().signInWithRedirect(this.props.provider).then(function(result) {
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
		const database = this.props.database;
		


		return (
			<div className="container-fluid app-global">
				<NavigationBar isWaiting={isWaiting} isLoggedIn={isLoggedIn} signIn={this.signIn} signOut={this.signOut} />
				<TabbedContainer isLoggedIn={isLoggedIn} database={this.props.database} />
				
				{isLoggedIn? (
					null
				) : (
					<PublicMarketTable isLoggedIn={isLoggedIn} database={this.props.database} />
				)}
    		</div>
		);


	}
}







//TODO: This will eventualy just have FirebaseLogin component, (or rather FirebaseLogin will be renamed App and replace this as a class declaration)


class App extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		
	}

	render() {
		const props = {
			provider: new firebase.auth.GoogleAuthProvider(),
			database: firebase.database()
		};

		return <FirebaseLogin {...props} />;
	}

  
}

export default hot(module)(App);





