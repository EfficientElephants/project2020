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
    
    componentWillReceiveProps(render) {
        if (this.props.render){
            this.getGoalsAll();
        }
    }


    render() {
        return (
        <div>
            {console.log(this.state.allGoals)}
            <ul>
                {(this.state.allGoals).map(total => (
                    <li key={total._id}>{total.category}</li>
                ))}
            </ul>
        </div>
        );
    }
}
export default Goals;