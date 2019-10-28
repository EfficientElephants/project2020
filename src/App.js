import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Users from './components/Users';

class App extends Component {

  render() {
    return (
      <div>
        <h1>Users</h1>
        <div className="header-bar" />
        <Users />
      </div>
    );
  }
}

export default App;
