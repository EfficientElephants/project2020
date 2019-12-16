import React, { Component } from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
//import  from '../api/transactionAPI';

function percent(props) {
    const goalAmount = props.goal.goalAmount;
    const spentAmount = props.goal.spentAmount;
    const percent = 100 * (spentAmount/goalAmount);
    return percent;
}

const GoalBar  = props => {
    return (
            <Col>
                <div>
                    <h4>{props.goal.category}</h4>
                    {console.log(percent)}
                    <ProgressBar striped variant="success" now={percent(props)} />
                </div>
            </Col>
    );
}
export default GoalBar;