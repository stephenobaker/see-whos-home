
//Test if you can get element by class name with one class out of many used

describe('Sign-In Button', function() {
	it('should exist', function() {
		expect(document.querySelector('.red')).toBeDefined()
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