/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Row, Col, ProgressBar
} from 'react-bootstrap';
// import  from '../api/transactionAPI';

class GoalBar extends Component {
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
    if (this.props.goal) {
      const goal = this.props.goal.goalAmount;
      const per = this.percent();
      const grad = this.gradient(per);
      this.setState({ percent: per, gradient: grad });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(rerender) {
    if (this.props.render) {
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

  // remaining() {
  //     const remains = (this.props.goal.goalAmount - this.props.goal.spentAmount);
  // return remains.toFixed(2);
  // }

  render() {
    if (this.props.goal) {
      return (
        <Col>
          <div>
            <h5>{this.props.goal.category}</h5>
            <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
            <Row>
              <Col>
                <p>
                  Goal Amount:
                  {this.props.goal.goalAmount}
                </p>
              </Col>
              <Col>
                <p>
                  Amount Spent:
                  {this.props.goal.spentAmount}
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
