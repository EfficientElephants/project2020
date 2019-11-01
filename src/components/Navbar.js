import { Navbar, Nav } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';


class NavBar extends Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Expense Elephant</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Dashboard</Nav.Link>
                    <Nav.Link href="/transactions">Transactions</Nav.Link>
                    <Nav.Link href="/income-mgr">Income Manager</Nav.Link>
                    <Nav.Link href="/goal-mgr">Goal Manager</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

export default NavBar;