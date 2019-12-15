import { Navbar, Nav, Button } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from './Authentication/Auth';
import { getFromStorage, removeFromStorage } from './Storage';


class NavBar extends Component {
    constructor(props) {
        super(props);

    this.onLogout = this.onLogout.bind(this);
    this.logoutNow = this.logoutNow.bind(this);
}

    onLogout() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            // Logout with token
            fetch('/api/logout?token=' + token)
            .then(res => res.json())
            .then(json => {
                if(json.success){
                    // remove token from local storage
                    removeFromStorage('expense_app');
                    this.logoutNow();
                } else {
                    this.setState({
                        isLoading: false,
                    })
                }
            })
        } else {
            this.setState({
                isLoading: false,
            })
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
                <Navbar class="navbar" collapseOnSelect variant="dark">
                    <Navbar.Brand>Expense Elephant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        
                        <Nav className="ml-auto justify-content-center" defaultActiveKey="/">
                            <Nav.Item>
                                <Link class="navbar-link" to="/dashboard">Dashboard</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link class="navbar-link" to="/transactions">Transactions</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link  class="navbar-link"to="/income-mgr">Income Manager</Link>&nbsp;
                            </Nav.Item>
                            <Nav.Item>
                                <Link class="navbar-link" to="/goal-mgr">Goal Manager</Link>&nbsp;
                            </Nav.Item>
                            <Button variant="secondary" class="logout-button" onClick={this.onLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavBar);