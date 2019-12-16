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

    render () {
        return (
            <Col>
                <div>
                    <h5>{this.props.goal.category}</h5>
                    {console.log(this.percent)}
                    <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
                </div>
            </Col>
        )
    }

}
export default GoalBar;