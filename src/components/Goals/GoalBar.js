import React, { Component } from 'react';
import { Row, Col, ProgressBar, Button } from 'react-bootstrap';
//import  from '../api/transactionAPI';

class GoalBar extends Component {
    constructor() {
        super();
        this.state = {
            gradient: "",
            percent: "",
            goalAmount: "",
            refresh: false
        };

        this.percent = this.percent.bind(this);
        this.gradient = this.gradient.bind(this);
        this.remaining = this.remaining.bind(this);
    }

    componentWillReceiveProps(rerender) {
        if (this.props.rerender) {
            this.componentDidMount();
        }
    }

    componentDidMount() {
        let goal = this.props.goal.goalAmount;
        let per = this.percent();
        let grad = this.gradient(per);
        this.setState({goalAmount:goal, percent:per, gradient:grad});
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
                    <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
                    <br />
                    <p>Goal Amount: {this.state.goalAmount}</p>
                    <p>Amount Spent: {this.props.goal.spentAmount}</p>
                    <p>Amount Remaining: {this.remaining()}</p>
                    <Button
                        variant="info"
                        onClick={() => this.props.onSelect(this.props.goal)}
                    >
                        Edit Goal
                    </Button>
                    &nbsp;
                    <Button
                        variant="danger"
                        onClick={e => this.props.onDelete(e, this.props.goal)}
                    >
                        Delete Goal
                    </Button>
                </div>
            </Col>
        )
    }

}
export default GoalBar;