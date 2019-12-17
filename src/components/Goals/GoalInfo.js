import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';
//import  from '../api/transactionAPI';

class GoalInfo extends Component {
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
        let goal = this.props.goalInfo.goalAmount;
        console.log(goal);
        let per = this.percent();
        console.log(per);
        let grad = this.gradient(per);
        console.log(grad);

        this.setState({goalAmount:goal, percent:per, gradient:grad});
    }
    
    percent() {
        const goalAmount = this.props.goalInfo.goalAmount;
        const spentAmount = this.props.goalInfo.spentAmount;
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
        const remains = (this.props.goalInfo.goalAmount - this.props.goalInfo.spentAmount);
        return remains.toFixed(2);
    }

    render () {
        return (
            <Col>
                <div>
                    <p>Goal Amount: {this.state.goalAmount}</p>
                    <p>Amount Spent: {this.props.goalInfo.spentAmount}</p>
                    <p>Amount Remaining: {this.remaining()}</p>
                    <Button
                        variant="info"
                        onClick={() => this.props.onSelect(this.props.goalInfo)}
                    >
                        Edit Goal
                    </Button>
                    &nbsp;
                    <Button
                        variant="danger"
                        onClick={e => this.props.onDelete(e, this.props.goalInfo)}
                    >
                        Delete Goal
                    </Button>
                </div>
            </Col>
        )
    }

}
export default GoalInfo;