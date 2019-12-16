import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import NavBar from '../Navbar';
import AddGoal from '../Goals/AddGoal';
import Goals from '../Goals/Goals';

class GoalManager extends Component {

    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <br />
                    <h1>Manage Your Goals</h1>
                    <br />
                    <AddGoal />
                    <Goals />

                    
                </Container>
            </div>
        );
    }
}

export default GoalManager;