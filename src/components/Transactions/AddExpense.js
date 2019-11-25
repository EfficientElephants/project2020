import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';

import AddExpenseModal from './AddExpenseModal';
import purchaseAPI from '../../api/purchaseAPI';
import { getFromStorage } from '../Storage';

class AddExpense extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            expenses: [],
            errors: {},
            showModal: false
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
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
                    this.setState({ userId: json.userId }) //, error: false })
                    //purchaseAPI.get(this.state.userId).then(json => this.setState({expenses:json}));  
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }

    handleChange(event) {
        let selectedExpense = this.state.selectedExpense;
        selectedExpense[event.target.name] = event.target.value;
        this.setState({ selectedExpense: selectedExpense });

    }

    handleCancel() {
        this.setState({ selectedExpense: null, showModal: false });
        this.handleDisableModal();

    }

    handleEnableModal () {
        this.setState({
            showModal: true,
            selectedExpense: {item: '', price:'', category: ''}
        });
        console.log("enabling");
        console.log(this.state.showModal);
        
    }

    handleDisableModal() {
        console.log("disabling");
        this.setState({
            showModal: false,
            selectedExpense: null
        })
    }

    handleSave(event) {
        console.log(event.currentTarget);
        event.preventDefault();

        if (this.validateForm()) {
            purchaseAPI
            .create(this.state.selectedExpense, this.state.userId)
            .then(result => {
                if (result.errors) {
                    console.log(result);
                    this.setState({error: true});

                }
                else {
                    console.log('Successfully created!');
                    this.setState({
                        selectedExpense: null
                    });
                    this.handleDisableModal();
                }
            })
        }
    }

    validateForm() {
        let v_expense = this.state.selectedExpense;
        let errors = {};
        let formIsValid = true;
  
        if (!v_expense.item) {
            formIsValid = false;
            errors["item"] = "Please enter an item.";
        }

        if (!v_expense.price) {
            formIsValid = false;
            errors["price"] = "Please enter a valid price.";
        }

        if (v_expense.price !== "undefined") {
            //regular expression for price validation
            var pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
            if (!pattern.test(v_expense.price)) {
                formIsValid = false;
                errors["price"] = "Please enter a valid non-negative price";
            }
        }

        if (!v_expense.category) {
            formIsValid = false;
            errors["category"] = "Please select a category.";
        }
        this.setState({errors: errors})
        return formIsValid
    }

    render() {
        return (
            <Container>
                <Row>
                    <div>
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Purchase</Button>
                        <AddExpenseModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedexpense = {this.state.selectedExpense}
                            errors = {this.state.errors}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddExpense;
