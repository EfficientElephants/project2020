import React, {
  Component
} from 'react';
import {
  Container
} from 'react-bootstrap';
import NavBar from '../Navbar';
import AddGoal from '../Goals/AddGoal';
import Goals from '../Goals/Goals';

class GoalManager extends Component {
  constructor() {
    super();
    this.state = {
      render: '',
    };
    this.rerender = this.rerender.bind(this);
  }

  rerender(val) {
    this.setState({ render: val });
    this.forceUpdate();
  }

  render() {
    const { render } = this.state;
    return (
      <div>
        <NavBar />
        <Container>
          <br />
          <h1>Manage Goals</h1>
          <br />
          <AddGoal
            stateChange={this.rerender}
          />
          <br />
          <Goals
            render={render}
          />

        </Container>
      </div>
    );
  }
}

export default GoalManager;
