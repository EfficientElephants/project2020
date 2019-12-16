import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { getFromStorage } from '../Storage';
import goalAPI from '../../api/goalAPI';
import GoalBar from './GoalBar';

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
    }

    render() {
        return (
        <div>
            {console.log(this.state.allGoals)}
            <Row>
                {(this.state.allGoals).map(total => {
                    return <GoalBar
                    goal={total}
                    key={total._id}
                    />
                })}
            </Row>
        </div>
        );
    }
}
export default Goals;