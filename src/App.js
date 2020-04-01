import React, { Component } from 'react';
import './App.css';
import { Route, HashRouter } from 'react-router-dom';
import { ProtectedRoute } from "./components/Authentication/ProtectedRoute";

import Login from './components//Authentication/Login';
import Signup from './components/Authentication/Signup';
// import ForgotPassword from './components/Authentication/ForgotPassword';
import Dashboard from './components/Dashboard';
import Transactions from './components/Pages/TransactionsPage';
import GoalManager from './components/Pages/GoalManager';
// import Reset from './components/Authentication/Reset';
import History from './components/Pages/History';
import Summary from './components/Pages/Summary';

class App extends Component {

  render() {
    return (  
        <HashRouter>
          <Route exact path="/" component={ Login }/>
          <Route exact path="/signup" component={ Signup }/>
          {/* <Route exact path="/forgotPassword" component={ ForgotPassword }/> */}
          {/* <Route exact path="/reset/:token" component={ Reset }/> */}
          <ProtectedRoute exact path="/transactions" component={ Transactions }/>
          <ProtectedRoute exact path="/dashboard" component={ Dashboard }/>
          <ProtectedRoute exact path="/goal-mgr" component={ GoalManager }/>
          <ProtectedRoute exact path="/history" component={ History }/>
          <ProtectedRoute exact path="/summary" component={ Summary }/>
        </HashRouter>
    );
  }
}

export default App;