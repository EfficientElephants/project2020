import React, { Component } from 'react';
//import { Container, Row, Table } from 'react-bootstrap';
import transactionAPI from '../api/transactionAPI';
import { getFromStorage } from './Storage';

class Totals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            allTotals: [],
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
                    this.setState({ userId: json.userId, error: false });
                    this.getTotalsAll();
                } else {
                    // handle error
                    console.log('not working');
                }
            })
        }
    }

    componentWillReceiveProps(render) {
        if (this.props.render){
            this.getTotalsAll();
        }
    }

    async getTotalsAll() {
        var resp = await(transactionAPI.getTotalsAll(this.state.userId).then(allTotals => {
            allTotals.forEach(function(item){
                item.totals = ((item.totals/100).toFixed(2));
            })
            return allTotals
        }));
        const allTotals = resp;
        const totalArray = JSON.stringify(allTotals);
        this.setState({allTotals:totalArray})
        return totalArray;
    }

    render() {
        return (
        <div>
            <p>Totals</p>
            <div>{this.state.allTotals}</div>
            {/* <ul>
                {this.getTotalsAll().map(total => (
                    <li key={total}>{total}</li>
                ))}
            </ul> */}
        </div>
        );
    }
}
export default Totals;