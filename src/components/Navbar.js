import { Navbar, Nav, Button } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from './Auth';


class NavBar extends Component {

    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand>Expense Elephant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto justify-content-end" defaultActiveKey="/">
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/transactions">Transactions</Link>
                            <Link to="/income-mgr">Income Manager</Link>
                            <Link to="/goal-mgr">Goal Manager</Link>
                            <Button onClick={() => {
                                auth.logout(() => {
                                    this.props.history.push("/");
                                })
                            }}>Logout</Button>

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>



            </div>
        );
    }
}

export default NavBar;