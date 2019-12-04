import React, { Component } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import Transaction from './TransactionRow';
import purchaseAPI from '../../api/purchaseAPI';
import { getFromStorage } from '../Storage';
import AddExpenseModal from './AddExpenseModal';

class TransactionTable extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            transactions: [],
            errors: {},
            showExpenseModal: false,
            showIncomeModal: false
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
                    this.setState({ userId: json.userId, error: false })
                    purchaseAPI.get(this.state.userId).then(json => this.setState({transactions:json}));  
                    
                }
            })
            
        }
    }

    handleSelect(transaction) {
        this.setState({ 
            selectedTransaction: transaction
        });
        this.handleEnableModal(transaction);
        console.log(transaction);
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

    handleSave(event) {
        event.preventDefault();
        if (this.state.selectedTransaction.transactionType === "expense"){
            if (this.validateExpenseForm()) {
                purchaseAPI
                    .update(this.state.selectedTransaction)
                    .then(() => {
                        this.setState({
                            selectedTransaction: null
                        });
                        this.handleDisableModal();
                    })
                    .catch(err => {});
            }
        }else{}
        
    }

    handleChange(event) {
        let selectedTransaction = this.state.selectedTransaction;
        selectedTransaction[event.target.name] = event.target.value;
        this.setState({
            selectedTransaction: selectedTransaction,
        })
    }

    handleCancel() {
        this.setState({ 
            selectedTransaction: null, 
        });
        this.handleDisableModal();
    }

    handleEnableModal (transaction) {
        if(transaction.transactionType === "expense"){
            this.setState({
                showExpenseModal: true
            });
        } else{
            this.setState({
                showIncomeModal: true
            })
        }
    }

    handleDisableModal() {
        this.setState({
            showExpenseModal: false,
            showIncomeModal: false, 
            selectedTransaction: null,
        })
    }

    validateExpenseForm() {
        let v_expense = this.state.selectedTransaction;
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
                        <AddExpenseModal
                            show={this.state.showExpenseModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedexpense = {this.state.selectedTransaction}
                            errors = {this.state.errors}
                        />
                    </div>
                </Row>
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
export default TransactionTable