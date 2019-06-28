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
		return <div className="m-2">Own a business?</div>;
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

		const vendorsPublicRef = this.props.database.ref('vendors');
		let newState = [];

		vendorsPublicRef.on('child_added', (snapshot) => {
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

		vendorsPublicRef.on('child_changed', (snapshot) => {
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

		vendorsPublicRef.on('child_removed', (snapshot) => {
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
		//this.props.database.ref('vendors').off();
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

	handleDelete() {
		const databaseRef = this.props.database.ref('markets/' + this.props.yourKey);
		databaseRef.remove();
	}

	render() {
		return (
			<div className="row justify-content-center align-items-center my-4">
				<div className="text-center text-sm-left col-12 col-sm-5">{this.props.vendorName}</div>
				<div className="col-12 col-sm-3">	
					<div className="row justify-content-center">
						<button className="col-auto btn btn-danger m-2" onClick={this.handleDelete}>Delete</button>
					</div>
				</div>
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
					name: item.market_name,
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
		//this.props.database.ref('markets').off();
	}

	render() {
		const divString = this.state.items.map((item) =>
			<MarketItem key={item.key} yourKey={item.key} vendorName={item.name} database={this.props.database} authUser={this.props.authUser} />
		);
		


	
		if (this.state.loading) {
			return (
				<div className="row">
					<div className="col-12 text-center">
						Loading...
					</div>
				</div>
			);		} else {
			return (
				<div className="row">
					<div className="col-12">
						<div className="row justify-content-center my-4">
							<div className="col-auto">
								Markets you own
							</div>
						</div>
						{divString}
					</div>
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
			market_name: this.state.value
		});
		event.preventDefault();
		this.setState({value: ''});
		this.props.goBack();
	}

	render() {
		const isLoggedIn = this.props.isLoggedIn;


		return (
			<div className="row justify-content-center">
				<div className="col-auto">
					<div className="row justify-content-center my-4">
						<div className="col-auto">
							Create a new market
						</div>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="nameInput">Market name:</label>
							<input id="nameInput" className="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
						</div>
						<div className="row justify-content-center my-4">	
							<div className="col-auto">
								<input className="btn btn-primary m-2" type="submit" value="Create" />
							</div>
							<div className="col-auto">
								<button className="btn btn-secondary m-2" onClick={this.props.goBack}>Cancel</button>
							</div>
						</div>
					</form>
				</div>
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
	}

	handleOpen() {
		this.props.itemRef.update({
			vendor_present: true
		});
	}

	handleClose() {
		this.props.itemRef.update({
			vendor_present: false
		});
	}

	handleDelete() {
		this.props.itemRef.remove();
	}

	render() {
		if (this.props.userId === this.props.isLoggedIn.uid) {
			return (
				<div className="row justify-content-center align-items-center my-4">
					<div className="text-center text-sm-left col-12 col-sm-5">{this.props.name} is {this.props.present ? 'open' : 'not open'}.</div>
					<div className="col-12 col-sm-4">	
						<div className="row justify-content-center">
							<button className="col-auto btn btn-secondary m-2" onClick={this.props.present ? this.handleClose : this.handleOpen}>{(this.props.present ? 'Close' : 'Open')}</button>
							<button className="col-auto btn btn-danger m-2" onClick={this.handleDelete}>Delete</button>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}


function VendorsManaged(props) {
	const divString = props.vendors.map((item) =>
		<VendorItem key={item.key} name={item.name} userId={item.userId} isLoggedIn={props.isLoggedIn} present={item.present} itemRef={firebase.database().ref(`vendors/${item.key}`)} />
	);
	
	return (
		<div className="row">
			<div className = "col-12">
				<div className="row justify-content-center my-4">
					<div className="col-auto">
						Vendors you own
					</div>
				</div>
				{divString}
			</div>
		</div>
	);
}


class CreateVendorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			valueName: '',
			valueMarket: ''
		};

		this.handleName = this.handleName.bind(this);
		this.handleMarket = this.handleMarket.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleName(event) {
		this.setState({
			valueName: event.target.value
		});
	}

	handleMarket(event) {
		this.setState({
			valueMarket: event.target.value
		});
	}

	handleSubmit(event) {
		this.props.database.ref('vendors').push().set({
			user_id: this.props.isLoggedIn.uid,
			vendor_name: this.state.valueName,
			vendor_market: this.state.valueMarket,
			vendor_present: false
		});
		event.preventDefault();
		this.setState({
			valueName: '',
			valueMarket: ''
		});
		this.props.goBack();
	}

	render() {
		const marketList = this.props.markets.map((market) =>
			<option key={market.key}>{market.name}</option>
		);

		return (
			<div className="row justify-content-center">
				<div className="col-auto">
					<div className="row justify-content-center my-4">
						<div className="col-auto">
							Create a new vendor
						</div>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="nameInput">Vendor name:</label>
							<input id="nameInput" className="form-control" type="text" value={this.state.valueName} onChange={this.handleName} />
						</div>
						<div className="form-group">
							<label htmlFor="marketSelect">Sells at:</label>
							<select id="marketSelect" className="form-control" type="text" value={this.state.valueMarket} onChange={this.handleMarket}>
								<option>Please choose one</option>
								{marketList}
							</select>
						</div>
						<div className="row justify-content-center my-4">	
							<div className="col-auto">
								<input className="btn btn-primary m-2" type="submit" value="Create" />
							</div>
							<div className="col-auto">
								<button className="btn btn-secondary m-2" onClick={this.props.goBack}>Cancel</button>
							</div>
						</div>
					</form>				
				</div>
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
					<div className="tab bottom row">
						<div className="col-12">
							<MarketsManaged authUser={this.props.isLoggedIn} database={this.props.database} {...this.props} />
						</div>
						<div className='col-12 d-flex justify-content-center'>	
							<button className = "btn btn-primary m-4" onClick={this.handleForward}>{this.props.createText}</button>
						</div>						
					</div>
				);	
			} else {
				return (
					<div className="tab bottom row">
						<div className="col-12">
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
					<div className="tab bottom row">
						<div className="col-12">
							<VendorsManaged {...this.props} />
						</div>
						<div className='col-12 d-flex justify-content-center'>	
							<button className = "btn btn-primary m-4" onClick={this.handleForward}>{this.props.createText}</button>
						</div>						
					</div>
				);	
			} else {
				return (
					<div className="tab bottom row">
						<div className="col-12">
							<CreateVendorForm {...this.props} goBack={this.handleBackward}/>
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
				<div className="row p-2 p-sm-4 p-md-5 justify-content-center">
					<div className="col-12 col-md-10 col-lg-8 col-xl-6">
						<div className="row">
							<div className={`tab ${isFirstTab ? 'live' : 'dead'} col-6`}>
								<div className="row justify-content-center">
									<button className="btn btn-link col-auto" onClick={this.goFirstTab}>Markets</button>
								</div>
							</div>
							<div className={`tab ${isFirstTab ? 'dead' : 'live'} col-6`}>
								<div className="row justify-content-center">
									<button className="btn btn-link col-auto" onClick={this.goSecondTab}>Vendors</button>
								</div>
							</div>
						</div>
					
						<div className="row">
							<div className="col-12">
								<MarketsCycle
									createText='Create New Market'
									tabIsLive={isFirstTab ? true : false}
									{...this.props}
								/>
								<VendorsCycle
									createText='Create New Vendor'
									tabIsLive={isFirstTab ? false : true}
									{...this.props}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}	
	}
}



function PublicMarketTest(props) {
	const vendors = props.vendors;
	const vendorsList = vendors.map((vendor) =>
		<div key={vendor.key}>{vendor.name}</div>
	);

	const markets = props.markets;
	const marketsList = markets.map((market) =>
		<div key={market.key}>{market.name}</div>
	);


	return (
		<div>
			<h1>Markets:</h1>
			{marketsList}
			<h1>Vendors:</h1>
			{vendorsList}
		</div>
	);
}



class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authUser: null,
			waiting: true,
			marketsLoading: true,
			vendorsLoading: true,
			vendors: [],
			markets: []
		};
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
	}

	signIn() {
		const provider = new firebase.auth.GoogleAuthProvider();

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
		let vendorsRef = firebase.database().ref('vendors');
		let marketsRef = firebase.database().ref('markets');

		let vendors = [];
		let markets = [];

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
		

		vendorsRef.on('child_added', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;

			vendors.push({
				name: item.vendor_name,
				present: item.vendor_present,
				market: item.vendor_market,
				userId: item.user_id,
				key: key
			});
			
			this.setState({
				vendors: vendors,
				vendorsLoading: false
			});
		});

		marketsRef.on('child_added', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			markets.push({
				name: item.market_name,
				userId: item.user_id,
				key: key
			});
			
			this.setState({
				markets: markets,
				marketsLoading: false
			});
		});

		vendorsRef.on('child_changed', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			let newData = {
				name: item.vendor_name,
				present: item.vendor_present,
				market: item.vendor_market,
				userId: item.user_id,
				key: key
			};
			
			for (var i = 0; i < vendors.length; i++) {
				if (vendors[i].key == key) {
					vendors.splice(i, 1, newData);
				}
			}
			
			this.setState({
				vendors: vendors
			});
		});

		marketsRef.on('child_changed', (snapshot) => {
			let item = snapshot.val();
			let key = snapshot.key;
			
			let newData = {
				name: item.market_name,
				userId: item.user_id,
				key: key
			};
			
			for (var i = 0; i < markets.length; i++) {
				if (markets[i].key == key) {
					markets.splice(i, 1, newData);
				}
			}
			
			this.setState({
				markets: markets
			});
		});

		vendorsRef.on('child_removed', (snapshot) => {
			let key = snapshot.key;
			for (var i = 0; i < vendors.length; i++) {
				if (vendors[i].key == key) {
					vendors.splice(i, 1);
				}
			}
			
			this.setState({
				vendors: vendors
			});
		});

		marketsRef.on('child_removed', (snapshot) => {
			let key = snapshot.key;
			for (var i = 0; i < markets.length; i++) {
				if (markets[i].key == key) {
					markets.splice(i, 1);
				}
			}
			
			this.setState({
				markets: markets
			});
		});
	}

	componentWillUnmount() {
		this.props.database.ref('vendors').off();
		this.props.database.ref('markets').off();
	}

	render() {
		//const isWaiting = this.state.waiting;
		//const isLoggedIn = this.state.authUser;
		//const database = firebase.database();
		const isMarketsLoading = this.state.marketsLoading;
		const isVendorsLoading = this.state.vendorsLoading;
		const props = {
			'isWaiting': this.state.waiting,
			'isLoggedIn': this.state.authUser,
			'signIn': this.signIn,
			'signOut': this.signOut,
			'vendors': this.state.vendors,
			'markets': this.state.markets,
			'database': firebase.database()
		};
		


		return (
			<div className="container-fluid app-global">
				<NavigationBar {...props} />

				<TabbedContainer {...props}/>
				
				{(isVendorsLoading || isMarketsLoading) ? (
					<div>Loading databases...</div>
				) : (
					<PublicMarketTest {...props}/>
				)}

				
				{props.isLoggedIn ? (
					null
				) : (
					<PublicMarketTable {...props} />
				)}
    		</div>
		);
	}
}

export default hot(module)(App);