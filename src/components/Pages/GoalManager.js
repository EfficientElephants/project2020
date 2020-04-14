import React, {
  Component
} from 'react';
import {
  Container,
  Card
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
    return (
      <div>
        <NavBar />
        <Container>
          <br />
          <h1>Goals</h1>
          <Card body>
            <p>
              Financial goals are personal objectives you can set for saving and spending money.
            </p>
            <p>
              We at
              {' '}
              <b>ExpenseElephant</b>
              {' '}
              think that by organizing your money now, you&apos;ll have more for later.
            </p>
          </Card>
          <p />
          <br />
          <div>
            <AddGoal
              stateChange={this.rerender}
            />
          </div>
          <br />
          <Goals
            render={this.state.render}
          />

        </Container>
      </div>
    );
  }
}

export default GoalManager;
