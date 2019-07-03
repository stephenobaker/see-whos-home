import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';

describe('See Who\'s Home App test', () => {   
  const wrapper = mount(<App />);
 //it('renders without crashing', () => {
      //const wrapper = shallow(<App />);
     // console.log(wrapper.debug());
  //});
  it('renders expected text', () => {
	  console.log(wrapper.find('NavigationBar').debug());
	  //expect(wrapper.find('NavigationBar').text()).toEqual("Who's at the Market?Own a business?Sign in with GoogleLoading databases...Choose a market:");
  });
});

describe('VendorItem', () => {
	const wrapper = mount(<App />);
	it('is open when props = open', () => {
		expect(wrapper.find('NavigationBar').text()).toEqual("Who's at the Market?Own a business?Sign in with GoogleLoading databases...Choose a market:");
	});
	it('is closed when props = closed', () => {

	});
});