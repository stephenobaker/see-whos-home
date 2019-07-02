import React from 'react';
//import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import App from '../src/App.js';
import SignInButtonSpan from '../src/App.js';
import UserPicture from '../src/App.js';
import UserWelcome from '../src/App.js';

//import jasmineEnzyme from 'jasmine-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe('<App />', () => {
	/*beforeEach(() => {
		jasmineEnzyme();
	});*/



	it('should display welcome message properly', () => {
		const wrapper = mount(<App />);

		//wrapper.setState({isWaiting: false});

		console.log(wrapper.find(UserPicture).debug());

		//expect(wrapper.text()).toEqual('Welcome, Josh!');
	});
	/*it('shouldnt have an image when signed out', () => {
		const wrapper = mount(<NavigationBar />);
		//expect(wrapper.find('img')).not.toExist();
		const image = shallow(<UserPicture />);
		console.log(image.debug());
		expect(image).toHaveProp({ isLoggedIn: undefined });
	});
	it('should have an image when signed in', () => {
		let navbar = shallow(<NavigationBar />);
		navbar.setProps({ isLoggedIn: true});
		//const image = mount(<UserPicture />);
		expect(navbar).toHaveProp({ isLoggedIn: true });
	});*/


});



//Test if you can get element by class name with one class out of many used

xdescribe('Sign-In Button', function() {
	it('should exist', function() {
		const wrapper = mount(<NavigationBar />);

		expect(wrapper.find('div')).toExist();
	});
});



//Tests for landing page items
xdescribe('Navigation Bar', function() {
	it('should have a sign-in button if user is signed out', function() {
		expect(document.querySelector('.sign-in-button')).toBeDefined()
	});
	it('should have a sign-out button if user is signed in', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
	it('should have a go-to-console button if user is signed in', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
});

xdescribe('Spaces List', function() {
	it('should have a sign-in button if user is signed out', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
	it('should have a sign-out button if user is signed in', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
	it('should have a go-to-console button if user is signed in', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
});

//Test for console view items
xdescribe('Console List Item Expand Button', function() {
	it('should initially be collapsed', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
	it('should expand when clicked', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
	it('should collapse when clicked again', function() {
		expect(document.getElementsByClassName('App')).toBeDefined()
	});
});

//Expect re-size of window to affect visibility of certain items (expect responsive design behaviors)