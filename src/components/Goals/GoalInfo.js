/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Col, Button, ProgressBar
} from 'react-bootstrap';
// import  from '../api/transactionAPI';

class GoalInfo extends Component {
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
  UNSAFE_componentWillReceiveProps(rerender) {
    if (this.props.rerender) {
      this.componentDidMount();
    }
  }

  percent() {
    const { goalAmount } = this.props.goal;
    const { spentAmount } = this.props.goal;
    const percent = 100 * (spentAmount / goalAmount);
    return percent.toFixed(0);
  }

  gradient(percent) {
    if (percent >= 75) {
      return 'danger';
    } if (percent >= 50) {
      return 'warning';
    }
    return 'success';
  }

  remaining() {
    const remains = (this.props.goal.goalAmount - this.props.goal.spentAmount);
    return remains.toFixed(2);
  }

  render() {
    return (
      <Col>
        <div>
          <h5>{this.props.goal.category}</h5>
          <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
          <br />
          <p>
            Goal Amount:
            {this.props.goal.goalAmount}
          </p>
          <p>
            Amount Spent:
            {this.props.goal.spentAmount}
          </p>
          <p>
            Amount Remaining:
            {this.remaining()}
          </p>
          <Button
            variant="info"
            onClick={() =>
              this.props.onSelect(this.props.goal)}
          >
            Edit Goal
          </Button>
                    &nbsp;
          <Button
            variant="danger"
            onClick={(e) =>
              this.props.onDelete(e, this.props.goal)}
          >
            Delete Goal
          </Button>
        </div>
      </Col>
    );
  }
}
export default GoalInfo;
