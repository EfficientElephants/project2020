import React, { Component } from 'react';
//import { Container, Row, Table } from 'react-bootstrap';
import purchaseAPI from '../api/purchaseAPI';
import { getFromStorage } from './Storage';

class Totals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            allTotals: [],
        }
    }
    componentDidMount() {
        // query for all of the logged in users transactions
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    this.setState({ userId: json.userId, error: false })
                    purchaseAPI.getTotalsAll(this.state.userId).then(allTotals => this.setState({allTotals: allTotals}))
                    console.log(this.state.allTotals);
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }

    getTotalsAll() {
        console.log(this.state.allTotals);
        (this.state.allTotals).forEach(function(item){
            item.totals = ((item.totals/100).toFixed(2));
        })
        console.log(this.state.allTotals);
    }
    render() {
        return (
        <div>
            Totals Here
            <div>{this.getTotalsAll()}</div>
        </div>
        );
    }
}
export default Totals