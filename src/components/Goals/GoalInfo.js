/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Col, Button, ProgressBar
} from 'react-bootstrap';
// import  from '../api/transactionAPI';

class GoalInfo extends Component {
  static gradient(percent) {
    if (percent >= 75) {
      return 'danger';
    } if (percent >= 50) {
      return 'warning';
    }
    return 'success';
  }

  constructor() {
    super();
    this.state = {
      gradient: '',
      percent: '',
    };

    this.percent = this.percent.bind(this);
    this.gradient = this.gradient.bind(this);
    this.remaining = this.remaining.bind(this);
  }

  componentDidMount() {
    const per = this.percent();
    const grad = this.gradient(per);
    this.setState({ percent: per, gradient: grad });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(render) {
    const { rerender } = this.props;
    if (rerender) {
      this.componentDidMount();
    }
  }

  percent() {
    const { goal } = this.props;
    const { goalAmount, spentAmount } = goal;
    const percent = 100 * (spentAmount / goalAmount);
    return percent.toFixed(0);
  }

  remaining() {
    const { goal } = this.props;
    const { goalAmount, spentAmount } = goal;
    const remains = (goalAmount - spentAmount);
    return remains.toFixed(2);
  }

  render() {
    const { goal, onSelect, onDelete } = this.props;
    const { gradient, percent } = this.state;
    return (
      <Col>
        <div>
          <h5>{goal.category}</h5>
          <ProgressBar striped variant={gradient} now={percent} label={`${percent}%`} />
          <br />
          <p>
            Goal Amount:
            {goal.goalAmount}
          </p>
          <p>
            Amount Spent:
            {goal.spentAmount}
          </p>
          <p>
            Amount Remaining:
            {this.remaining()}
          </p>
          <Button
            variant="info"
            onClick={() =>
              onSelect(goal)}
          >
            Edit Goal
          </Button>
                    &nbsp;
          <Button
            variant="danger"
            onClick={(e) =>
              onDelete(e, goal)}
          >
            Delete Goal
          </Button>
        </div>
      </Col>
    );
  }
}
export default GoalInfo;
