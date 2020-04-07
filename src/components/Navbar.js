import { Navbar, Nav, Button } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from './Authentication/Auth';
import { getFromStorage, removeFromStorage } from './Storage';
import Logo from '../assets/expense-elephant-logo.png';


class NavBar extends Component {
    constructor(props) {
        super(props);

        this.onLogout = this.onLogout.bind(this);
        this.logoutNow = this.logoutNow.bind(this);
    }
    onLogout() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            // remove token from local storage
            removeFromStorage('expense_app');
            this.logoutNow()
        }
    }

    logoutNow() {
        auth.logout(() => {
            this.props.history.push("/");
        })
    }

    render() {
        return (
            <div className="center-navbar">
                <Navbar className="navbar" collapseOnSelect expand="lg" variant="dark">
                    <Navbar.Brand> 
                        <h3 className="company">
                            <Link className="navbar-link-home" to="/dashboard">Expense Elephant</Link>
                        </h3>
                        <img src={Logo} height="42" width="42" alt="Expense Elephant Logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                        
                        <Nav defaultActiveKey="/">
                            <Nav.Item>
                                <Link className="navbar-link" to="/dashboard">Dashboard</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="navbar-link" to="/transactions">Transactions</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="navbar-link" to="/goal-mgr">Goal Manager</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="navbar-link" to="/history">Historical Data</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="navbar-link" to="/summary">Summary</Link>&nbsp;
                            </Nav.Item>
                        </Nav>
                        <Button variant="light" className="logout-button" onClick={this.onLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavBar);