import React, { Component } from 'react';

import Users from './Users';
import Navbar from './Navbar';

class Dashboard extends Component {

    render() {
      return (
        <div>
          <Navbar />
          <h1>Users</h1>
          <div className="header-bar" />
          <Users />
        </div>
      );
    }
  }
  
  export default Dashboard;