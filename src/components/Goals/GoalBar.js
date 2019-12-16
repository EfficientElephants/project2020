import React, { Component } from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
//import  from '../api/transactionAPI';

class GoalBar extends Component {
    constructor() {
        super();
        this.state = {
            gradient: "",
            percent: ""
        };

        this.percent = this.percent.bind(this);
        this.gradient = this.gradient.bind(this);
        this.remaining = this.remaining.bind(this);
    }

    componentDidMount() {
        let per = this.percent();
        let grad = this.gradient(per);
        this.setState({percent:per, gradient:grad});
    }
    
    percent() {
        const goalAmount = this.props.goal.goalAmount;
        const spentAmount = this.props.goal.spentAmount;
        const percent = 100 * (spentAmount/goalAmount);
        return percent.toFixed(0);
    }

    gradient(percent) {
        if (percent >= 75) {
            return "danger";
        } else if (percent >= 50) {
            return "warning";
        } else {
            return "success";
        }
    }

    remaining() {
        const remains = (this.props.goal.goalAmount - this.props.goal.spentAmount);
        return remains.toFixed(2);
    }

    render () {
        return (
            <Col>
                <div>
                    <h5>{this.props.goal.category}</h5>
                    {console.log(this.percent)}
                    <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
                    <br />
                    <p>Goal Amount: {this.props.goal.goalAmount}</p>
                    <p>Amount Spent: {this.props.goal.spentAmount}</p>
                    <p>Amount Remaining: {this.remaining()}</p>
                </div>
            </Col>
        )
    }

}
export default GoalBar;