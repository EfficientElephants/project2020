import React, { Component } from 'react';
import './App.css';
import { Route, HashRouter } from 'react-router-dom';
import { ProtectedRoute } from "./components/Authentication/ProtectedRoute";

import Login from './components//Authentication/Login';
import Signup from './components/Authentication/Signup';
import Dashboard from './components/Dashboard';
import Transactions from './components/Pages/TransactionsPage';
import IncomeManager from './components/Pages/IncomeManager';
import GoalManager from './components/Pages/GoalManager';
import History from './components/Pages/History';
import Summary from './components/Pages/Summary';

class App extends Component {

  render() {
    return (  
        <HashRouter>
          <Route exact path="/" component={ Login }/>
          <Route exact path="/signup" component={ Signup }/>
          <ProtectedRoute exact path="/transactions" component={ Transactions }/>
          <ProtectedRoute exact path="/dashboard" component={ Dashboard }/>
          <ProtectedRoute exact path="/goal-mgr" component={ GoalManager }/>
          <ProtectedRoute exact path="/income-mgr" component={ IncomeManager }/>
          <ProtectedRoute exact path="/history" component={ History }/>
          <ProtectedRoute exact path="/summary" component={ Summary }/>
        </HashRouter>
    );
  }
}

export default App;