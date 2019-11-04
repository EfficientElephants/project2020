import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import IncomeManager from './components/IncomeManager';
import GoalManager from './components/GoalManager';
import DefaultContainer from './components/DefaultContainer';

class App extends Component {

  render() {
    return (  
      <div>
          <Route exact path="/" component={ Login }/>
          <ProtectedRoute exact path="/home" component={ DefaultContainer }/>
          <ProtectedRoute exact path="/transactions" component={ Transactions }/>
          <ProtectedRoute exact path="/dashboard" component={ Dashboard }/>
          <ProtectedRoute exact path="/goal-mgr" component={ GoalManager }/>
          <ProtectedRoute exact path="/income-mgr" component={ IncomeManager }/>
      </div>
    );
  }
}

export default App;