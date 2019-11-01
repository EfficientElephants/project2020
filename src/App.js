import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Users from './components/Users';
import NavBar from './components/NavBar';

class App extends Component {

  render() {
    return (
      <div>
        <h1>Users</h1>
        <div className="header-bar" />
        <NavBar />
        <Users />
      </div>
    );
  }
}

export default App;
