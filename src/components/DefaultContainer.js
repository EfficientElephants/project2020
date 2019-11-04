import React, {Component} from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { ProtectedRoute } from "./ProtectedRoute";

import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import IncomeManager from './IncomeManager';
import GoalManager from './GoalManager';

class DefaultContainer extends Component {
    render() {
        return (
            <div>
                <Navbar />
                {/* <Redirect exact from="/home" to="dashboard" /> */}
                <Route exact path="/home" render={() => (
                    <Redirect to="/dashboard"/>
                )}/>
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/transactions" component={Transactions} />
                <ProtectedRoute path="/income-mgr" component={IncomeManager} />
                <ProtectedRoute path="/goal-mgr" component={GoalManager} />
            </div>
        );
    }
}

export default withRouter(DefaultContainer);
