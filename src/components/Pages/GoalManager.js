import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import NavBar from '../Navbar';
import AddGoal from '../Goals/AddGoal';
import Goals from '../Goals/Goals';

class GoalManager extends Component {

//     const now = 60;
//     const progressInstance = <ProgressBar now={now} label={`${now}%`} srOnly />;

// render(progressInstance);

    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <br />
                    <h1>Manage Goals</h1>
                    <br />
                    <AddGoal />
                    <br />
                    <Goals />
                </Container>
            </div>
        );
    }
}

export default GoalManager;