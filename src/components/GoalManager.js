import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import NavBar from './Navbar';

class GoalManager extends Component {

    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <br />
                    <h1>Manage Your Goals</h1>
                    <br />
                    <p>Manage all of your loan saving/budgeting goals here!</p>
                </Container>
            </div>
        );
    }
}

export default GoalManager;