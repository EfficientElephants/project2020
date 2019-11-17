import React, { Component } from 'react';
import { Container, Row, Button, Table } from 'react-bootstrap';

import Expense from './Expense';
import EditExpense from './EditExpense';
import purchaseAPI from '../../api/purchaseAPI';



class Expenses extends Component {
    constructor() {
        super();
        this.state = { expenses: [], 
                       addingExpense: false, 
                       error: false,
                       defaultSelect: "Rent"
                    };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    }
    componentDidMount() {
        purchaseAPI.get().then(json => this.setState({expenses:json}));
    }
    

    handleSelect(expense) {
        this.setState({ selectedExpense: expense });
        console.log(expense);
    }

    handleDelete(event, expense) {
        event.stopPropagation();
        purchaseAPI.destroy(expense).then(() => {
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
        purchaseAPI
            .create(this.state.selectedExpense)
            .then(result => {
                if (result.errors) {
                    console.log(result);
                    this.setState({error: true});

                }
                else {
                    console.log('Successfully created!');
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
        purchaseAPI.get().then(json => this.setState({expenses:json}));
        } else {
            console.log(this.state.selectedExpense)
        purchaseAPI
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
        }else {
            return (<div></div>)
        }
    }

    


    render() {
        // console.log(this.state.defaultSelect);
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