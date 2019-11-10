import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from './Auth';


class NavBar extends Component {

    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                    <Navbar.Brand>Expense Elephant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto justify-content-end" defaultActiveKey="/">
                            <Link to="/dashboard">Dashboard</Link>&nbsp;
                            <Link to="/transactions">Transactions</Link>&nbsp;
                            <Link to="/income-mgr">Income Manager</Link>&nbsp;
                            <Link to="/goal-mgr">Goal Manager</Link>&nbsp;
                            <Button onClick={() => {
                                auth.logout(() => {
                                    this.props.history.push("/");
                                })
                            }}>Logout</Button>

                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavBar);