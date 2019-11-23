import React, { Component } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import Transaction from './Transaction';
import purchaseAPI from '../../../api/purchaseAPI';

class PurchaseTransactions extends Component {
    constructor() {
        super();
        this.state = {
            transactions: [],
        }
        this.handleSelect = this.handleSelect.bind(this);
        //this.handleSave = this.handleSave.bind(this);
        //this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        purchaseAPI.get().then(json => this.setState({transactions:json}));
    }

    handleSelect(transaction) {
        this.setState({ selectedTransaction: transaction });
        console.log(transaction);
    }

    handleChange(event) {
        let selectedTransaction = this.state.selectedTransaction;
        selectedTransaction[event.target.name] = event.target.value;
        this.setState({ selectedTransaction: selectedTransaction });

    }

    handleDelete(event, transaction) {
        console.log(transaction);
        event.stopPropagation();
        purchaseAPI.destroy(transaction).then(() => {
            let transactions = this.state.transactions;
            transactions = transactions.filter(h => h !== transaction);
            this.setState({ transactions: transactions });
    
            if (this.selectedTransaction === transaction) {
                this.setState({ selectedTransaction: null });
            }
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.transactions.map(transaction => {
                                return <Transaction
                                    transaction={transaction}
                                    key={transaction._id}
                                    onSelect={this.handleSelect} 
                                    selectedTransaction = {this.state.selectedTransaction}
                                    onDelete={this.handleDelete}
                                />
                            })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        )
    }
}
export default PurchaseTransactions