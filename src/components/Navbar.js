import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from './Auth';
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
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                    <Navbar.Brand>Expense Elephant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto justify-content-end" defaultActiveKey="/">
                            <Link to="/dashboard">Dashboard</Link>&nbsp;
                            <Link to="/transactions">Transactions</Link>&nbsp;
                            <Link to="/income-mgr">Income Manager</Link>&nbsp;
                            <Link to="/goal-mgr">Goal Manager</Link>&nbsp;
                            <Button onClick={this.onLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavBar);