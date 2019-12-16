import React, { Component } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
//import  from '../api/transactionAPI';
import { getFromStorage } from '../Storage';
import goalAPI from '../../api/goalAPI';

class Goals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            allGoals: [],
        }
    }
    async componentDidMount() {
        // query for all of the logged in users transactions
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            await fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    this.setState({ userId: json.userId, error: false })
                    goalAPI.get(this.state.userId).then(json => {
                        console.log(json);
                        this.setState({allGoals: json})
                    }); 
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }

        function progressBar() {
            const progressInstance = <ProgressBar now={now} label={`${now}%`} srOnly />;
            const now = 60;
            return progressInstance;
        }

    }

    render() {
        return (
        <div>
            {console.log(this.state.allGoals)}
            <ul>
                {(this.state.allGoals).map(total => (
                    <li key={total._id}>{total.category}, Goal: {total.goalAmount}, Spent: {total.spentAmount}</li>
                ))}
            </ul>
            <Row>
            <Col>
                <div>
                    <h4>Goal 1</h4>
                    <ProgressBar striped variant="success" now={40} />
                    {/* {(progressBar().progressInstance)} */}
                </div>
            </Col>
            <Col>
                <div>
                    <h4>Goal 2</h4>
                    <ProgressBar striped variant="success" now={40} />
                    {/* {(progressBar().progressInstance)} */}
                </div>
            </Col>
            </Row>

        </div>
        );
    }
}
export default Goals;