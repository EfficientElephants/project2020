import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import Login from './components/Login';
import { ProtectedRoute } from "./components/ProtectedRoute";
import NavBar from './components/Navbar';

class App extends Component {

  render() {
    return (  
      <div>
        <Switch>
          <Route exact path="/" component={ Login }/>
          <ProtectedRoute exact path="/navbar" component={ NavBar }/>
          {/* <Route path="*" compnent={() => "404 NOT FOUND"}/> */}
        </Switch>
      </div>

    );
  }
}

export default App;
