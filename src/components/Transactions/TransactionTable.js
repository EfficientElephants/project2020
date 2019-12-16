import React, { Component } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import { parseISO, format } from 'date-fns';
import Transaction from './TransactionRow';
import transactionAPI from '../../api/transactionAPI';
import goalAPI from '../../api/goalAPI'
import { getFromStorage } from '../Storage';
import AddExpenseModal from './Expense/AddExpenseModal';
import AddIncomeModal from './Income/AddIncomeModal';

class TransactionTable extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            transactions: [],
            errors: {},
            showExpenseModal: false,
            showIncomeModal: false,
            rerender: false
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
    }
    componentWillReceiveProps(render) {
        if (this.props.render){
            transactionAPI.get(this.state.userId).then(json => this.setState({transactions:json}));  
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
                    transactionAPI.get(this.state.userId).then(json => this.setState({transactions:json}));  
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }

    handleDateChange(val, propSelected){
        this.setState({date: val});
        let selectedTransaction = propSelected;
        selectedTransaction['date'] = val;
        this.setState({selectedTransaction: selectedTransaction});
    }

    handleSelect(transaction) {
        this.setState({ 
            selectedTransaction: transaction, 
            editingTransaction: transaction
        });
        this.handleEnableModal(transaction);
    }

    async handleDelete(event, transaction) {
        event.stopPropagation();
        let price = transaction.price
        transactionAPI.destroy(transaction).then(() => {
            let transactions = this.state.transactions;
            transactions = transactions.filter(h => h !== transaction);
            this.setState({ transactions: transactions });
    
            if (this.selectedTransaction === transaction) {
                this.setState({ selectedTransaction: null });
            }
        });
        var goals = await (goalAPI
            .get(this.state.userId)
            .then(goals => {
                return goals
            })
        )
        var goal = null;
        goals.forEach( (item) => {
            if (item.category === transaction.category){
                goal = item;
            }
        })
        if (goal){
            goal.spentAmount = parseFloat(goal.spentAmount) - parseFloat(price)
            goalAPI
                .update(goal)
                .catch(err => {});
        }
        
    }

    async handleSave(event) {
        event.preventDefault();
        let validatedInputs = false
        if (this.state.selectedTransaction.transactionType === "expense"){
            if (this.validateExpenseForm()) {
                validatedInputs = true;
            }
        }else if (this.state.selectedTransaction.transactionType === "income"){
            if (this.validateIncomeForm()){
                validatedInputs = true;
            }
        }
        if(validatedInputs){
            // eslint-disable-next-line
            var transRes = await(transactionAPI
                .update(this.state.selectedTransaction)
                .then(() => {
                    this.setState({
                        selectedTransaction: null
                    });
                })
                .catch(err => {}));
            
            var allTotals = await(transactionAPI.getTotalsAll(this.state.userId).then(allTotals => {
                allTotals.forEach(function(item){
                    item.totals = ((item.totals/100).toFixed(2));
                })
                return allTotals
            }));

            var allGoals = await(goalAPI.get(this.state.userId).then(allGoals => {return allGoals}))

            var updatedGoal = null;
            allTotals.forEach(function(total){
                allGoals.forEach(function(goal){
                    if (goal.category === total._id){
                        updatedGoal = goal
                        updatedGoal.spentAmount = total.totals
                    }
                })
            });

            if (updatedGoal) {
                goalAPI
                .update(updatedGoal)
                .catch(err => {});
            }

            await transactionAPI.get(this.state.userId).then(json => this.setState({transactions:json}));  
            this.handleDisableModal();
            
        }
    }

    handleChange(event) {
        let selectedTransaction = this.state.selectedTransaction;
        selectedTransaction[event.target.name] = event.target.value;
        this.setState({
            selectedTransaction: selectedTransaction
        })
    }

    handleCancel() {
        transactionAPI.get(this.state.userId).then(json => this.setState({transactions:json}));  
        this.setState({ 
            selectedTransaction: null, 
        });
        this.handleDisableModal();
    }

    handleEnableModal (transaction) {
        transaction.date = (parseISO(transaction.date));
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

    validateIncomeForm() {
        let v_income = this.state.selectedTransaction;
        let errors = {};
        let formIsValid = true;
  
        if (!v_income.item) {
            formIsValid = false;
            errors["item"] = "Please enter an income source.";
        }

        if (!v_income.price) {
            formIsValid = false;
            errors["price"] = "Please enter a valid amount.";
        }

        if (v_income.price !== "") {
            //regular expression for price validation
            var pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
            if (!pattern.test(v_income.price)) {
                formIsValid = false;
                errors["price"] = "Please enter a valid non-negative amount";
            }
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
                            datechange = {this.handleDateChange}
                        />
                        <AddIncomeModal
                            show={this.state.showIncomeModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedincome = {this.state.selectedTransaction}
                            errors = {this.state.errors}
                            datechange = {this.handleDateChange}
                        />
                    </div>
                </Row>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
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
                            <tr>
                                <th>I AM TESTING THIS</th>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
        )
    }
}
export default TransactionTable;