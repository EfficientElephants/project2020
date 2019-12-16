import React, { Component } from 'react';
import { Container, Row, Button, Table } from 'react-bootstrap';
import Expense from './Expense';
import EditExpense from './EditExpense';
import transactionAPI from '../../../api/transactionAPI';
import { getFromStorage } from '../../Storage';


class Expenses extends Component {
    constructor() {
        super();
        this.state = { userId: '', expenses: [], addingExpense: false, error: false};

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

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
                    transactionAPI.get(this.state.userId).then(json => this.setState({expenses:json}));  
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }

    handleSelect(expense) {
        this.setState({ selectedExpense: expense });
    }

    handleDelete(event, expense) {
        event.stopPropagation();
        transactionAPI.destroy(expense).then(() => {
            let expenses = this.state.expenses;
            expenses = expenses.filter(h => h !== expense);
            this.setState({ expenses: expenses });
    
            if (this.selectedExpense === expense) {
                this.setState({ selectedExpense: null });
            }
        });
    }

    handleSave () {
        let expenses = this.state.expenses;
        

        if (this.state.addingExpense) {
        transactionAPI
            .create(this.state.selectedExpense, this.state.userId)
            .then(result => {
                if (result.errors) {
                    this.setState({error: true});
                }
                else {
                    expenses.push(this.state.selectedExpense);
                    this.setState({
                        expenses: expenses,
                        selectedExpense: null,
                        addingExpense: false,
                        error: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
        transactionAPI.get().then(json => this.setState({expenses:json}));
        } else {
            transactionAPI
                .update(this.state.selectedExpense)
                .then(() => {
                    this.setState({ selectedExpense: null });
                })
                .catch(err => {});
        }
    }

    handleChange(event) {
        let selectedExpense = this.state.selectedExpense;
        selectedExpense[event.target.name] = event.target.value;
        this.setState({ selectedExpense: selectedExpense });

    }

    handleCancel() {
        this.setState({ selectedExpense: null, addingExpense: false})
    }

    handleEnableAddMode() {
        this.setState({
            addingExpense: true,
            selectedExpense: {item: '', price:'', category: 'Rent'}
        });
    }

    errorNotifcation () {
        let errorValue = this.state.error;
        if (errorValue) {
            return (
                <div class="alert alert-danger" role="alert">
                    <strong>Oh snap!</strong> Either your email or username is already in use. Please try again.
                </div>
            )
        } else {
            return (<div></div>)
        }
    }

    render() {
        return (
            <Container>
                <Row>
                <div>
                    <Button variant="secondary" onClick={this.handleEnableAddMode}>Add New Purchase</Button>
                    <EditExpense 
                        addingExpense = {this.state.addingExpense} 
                        selectedExpense={this.state.selectedExpense}
                        onChange={this.handleChange}
                        onSave = {this.handleSave}
                        onCancel = {this.handleCancel}
                        defaultState={this.state.defaultSelect}
                        
                    />
                </div>
                </Row>
                {/* <Row>
                    {this.errorNotifcation()}
                </Row> */}
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
                            {this.state.expenses.map(expense =>{
                                return <Expense 
                                    expense={expense} 
                                    onSelect={this.handleSelect} 
                                    selectedExpense = {this.state.selectedExpense}
                                    onDelete={this.handleDelete} 
                                />
                            })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
}
export default Expenses;