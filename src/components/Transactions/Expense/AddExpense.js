import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { parseISO, format } from 'date-fns';
import AddExpenseModal from './AddExpenseModal';
import transactionAPI from '../../../api/transactionAPI';
import { getFromStorage } from '../../Storage';
import goalAPI from '../../../api/goalAPI';

class AddExpense extends Component {
    constructor(props) {
        super();
        this.state = {
            userId: '',
            expenses: [],
            errors: {},
            showModal: false, 
            date: new Date()
        };
        this.handleDateChange = this.handleDateChange.bind(this);
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
                    // transactionAPI.get(this.state.userId).then(json => this.setState({expenses:json}));  
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
        }
    }

    handleDateChange(val, propSelected){
        this.setState({date: val});
        console.log(this.state.date)
        let selectedExpense = propSelected;
        selectedExpense['date'] = val;
        this.setState({selectedExpense: selectedExpense});
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
        console.log(this.state.date);
        this.setState({
            showModal: true,
            selectedExpense: {date: this.state.date, item: '', price:'', category: '', transactionType: 'expense'}
        });
        console.log("enabling");
        
    }

    handleDisableModal() {
        console.log("disabling");
        this.setState({
            showModal: false,
            selectedExpense: null
        })
    }

    async handleSave(event) {
        event.preventDefault();      
        
        console.log(this.state.selectedExpense);

        if (this.validateForm()) {
            var allGoals = await (goalAPI
            .get(this.state.userId)
            .then(goals => {
                return goals
            }));
            var goal = null;
            var selectedExpenseCat = this.state.selectedExpense.category;
            var selectedExpensePrice = this.state.selectedExpense.price;
            allGoals.forEach(function (element){
                if(element.category === selectedExpenseCat){
                    goal = element;
                }
                
            })
            if (goal) {
                goal.spentAmount = parseFloat(goal.spentAmount) + parseFloat(selectedExpensePrice);
                goalAPI
                    .update(goal)
                    .catch(err => {});
            }
            transactionAPI
            .create(this.state.selectedExpense, this.state.userId)
            .then(result => {
                if (result.errors) {
                    this.setState({error: true});
                }
                else {
                    console.log('Successfully created!');
                    this.setState({
                        selectedExpense: null, 
                        alertOpen: true
                    });
                    this.handleDisableModal();
                    if (this.props.typeChange){
                        console.log(true);
                        this.handleAlert();
                    }else{
                        this.props.stateChange(true);
                    }
                    
                }
            });
        }
    }
    handleAlert(){
        this.props.typeChange('expense');
        this.props.stateChange(true);
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

        if (v_expense.price !== "") {
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
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Expense</Button>
                        <AddExpenseModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedexpense = {this.state.selectedExpense}
                            errors = {this.state.errors}
                            datechange = {this.handleDateChange}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddExpense;
