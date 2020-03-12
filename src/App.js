import React, { Component } from 'react';
import './App.css';
import { Route, HashRouter } from 'react-router-dom';
import { ProtectedRoute } from "./components/Authentication/ProtectedRoute";

import Login from './components//Authentication/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Pages/TransactionsPage';
import IncomeManager from './components/Pages/IncomeManager';
import GoalManager from './components/Pages/GoalManager';
import History from './components/Pages/History';

class App extends Component {

  render() {
    return (  
        <HashRouter>
          <Route exact path="/" component={ Login }/>
          <ProtectedRoute exact path="/transactions" component={ Transactions }/>
          <ProtectedRoute exact path="/dashboard" component={ Dashboard }/>
          <ProtectedRoute exact path="/goal-mgr" component={ GoalManager }/>
          <ProtectedRoute exact path="/income-mgr" component={ IncomeManager }/>
          <ProtectedRoute exact path="/history" component={ History }/>
        </HashRouter>
    );
  }
}

export default App;
