import React, { Component} from "react";
import {hot} from "react-hot-loader";
import "./App.css";

function Welcome(props) {
	return <h1 className="Welcome">Hello, {props.name}</h1>
}

function App() {
  return(
    <div className="App">
      <Welcome name="Sara" />
      <Welcome name="Kyle" />
      <Welcome name="Billy" />
    </div>
  );
}


// class App extends Component{
//   render(){
//     return(
//       <div className="App">
//         <Welcome name="Sara" />
//         <Welcome name="Chad" />
//       </div>
//     );
//   }
// }


export default hot(module)(App);