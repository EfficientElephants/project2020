import React, {
  Component
} from 'react';
import {
  Row, Col, ProgressBar
} from 'react-bootstrap';
import PropTypes from 'prop-types';
// import  from '../api/transactionAPI';

class GoalBar extends Component {
  constructor() {
    super();
    this.state = {
      gradient: '',
      percent: '',
      goalAmount: '',
      refresh: false,
    };

    this.percent = this.percent.bind(this);
    this.gradient = this.gradient.bind(this);
  }

  // eslint-disable-next-line no-unused-vars
  UNSAFE_componentWillReceiveProps(rerender) {
    if (this.props.render) {
      this.componentDidMount();
      console.log(this.props.goal.spentAmount);
    }
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.goal) {
      const goal = this.props.goal.goalAmount;
      const per = this.percent();
      const grad = this.gradient(per);
      this.setState({ goalAmount: goal, percent: per, gradient: grad });
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
            <ProgressBar
              striped
              variant={this.state.gradient}
              now={this.state.percent}
              label={`${this.state.percent}%`}
            />
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
                  {' '}
                  {this.props.goal.spentAmount}
                </p>
              </Col>
            </Row>
            <br />
          </div>
        </Col>
      );
    }
    return <div />;
  }
}

GoalBar.propTypes = {
  goal: PropTypes.object.isRequired,
  render: PropTypes.bool,
};

export default GoalBar;
