import React, { Component } from 'react';
//import { Container, Row, Table } from 'react-bootstrap';
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
                    this.getGoalsAll();     
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }
    
    componentWillReceiveProps(render) {
        if (this.props.render){
            this.getGoalsAll();
        }
    }

    async getGoalsAll() {
        var res = await (goalAPI.get(this.state.userId)
            .then(allGoals => {
                console.log(allGoals);
                return allGoals
            }) 
        );
        const allGoals = res;
        const goalArray = JSON.stringify(allGoals);
        this.setState({allGoals: goalArray})
        console.log(goalArray);
        return goalArray;
    }

    render() {
        return (
        <div>
            <p>Goals</p>
            <div>{this.state.allGoals}</div>
            {/* <ul>
                {this.getGoalsAll().map(total => (
                    <li key={total}>{total}</li>
                ))}
            </ul> */}
        </div>
        );
    }
}
export default Goals;