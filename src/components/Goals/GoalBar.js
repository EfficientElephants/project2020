/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Row, Col, ProgressBar
} from 'react-bootstrap';
// import  from '../api/transactionAPI';

class GoalBar extends Component {
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
    // this.remaining = this.remaining.bind(this);
  }


  componentDidMount() {
    const { goal } = this.props;
    if (goal) {
      const per = this.percent();
      const grad = this.gradient(per);
      this.setState({ percent: per, gradient: grad });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(rerender) {
    const { render } = this.props;
    if (render) {
      this.componentDidMount();
    }
  }

  percent() {
    const { goal } = this.props;
    const { goalAmount, spentAmount } = goal;
    const percent = 100 * (spentAmount / goalAmount);
    return percent.toFixed(0);
  }

  render() {
    const { goal } = this.props;
    const { gradient, percent } = this.state;
    if (goal) {
      return (
        <Col>
          <div>
            <h5>{goal.category}</h5>
            <ProgressBar striped variant={gradient} now={percent} label={`${percent}%`} />
            <Row>
              <Col>
                <p>
                  Goal Amount:
                  {goal.goalAmount}
                </p>
              </Col>
              <Col>
                <p>
                  Amount Spent:
                  {goal.spentAmount}
                </p>
              </Col>
            </Row>
            <br />
          </div>
        </Col>
      );
    }
    return (<div />);
  }
}
export default GoalBar;
