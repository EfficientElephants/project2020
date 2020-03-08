import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';

import AddIncomeModal from './AddIncomeModal';
import transactionAPI from '../../../api/transactionAPI';
import { getFromStorage } from '../../Storage';
var dateformat = require('dateformat');

class AddIncome extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            income: [],
            errors: {},
            date: new Date(), 
            showModal: false
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
        let selectedIncome = propSelected;
        selectedIncome['date'] = val;
        selectedIncome['monthYearId'] = dateformat(val, 'mmyy')
        this.setState({selectedIncome: selectedIncome});
    }

    handleChange(event) {
        let selectedIncome = this.state.selectedIncome;
        selectedIncome[event.target.name] = event.target.value;
        this.setState({ selectedIncome: selectedIncome });

    }

    handleCancel() {
        this.setState({ selectedIncome: null, showModal: false });
        this.handleDisableModal();

    }

    handleEnableModal () {
        this.setState({
            showModal: true,
            selectedIncome: {date: this.state.date, monthYearId: dateformat(this.state.date, 'mmyy'), item: '', price:'', category: 'Income', transactionType: 'income'}
        });
        
    }

    handleDisableModal() {
        this.setState({
            showModal: false,
            selectedIncome: null, 
            date: new Date()
        })
    }

    handleSave(event) {
        event.preventDefault();

        if (this.validateForm()) {
            transactionAPI
            .create(this.state.selectedIncome, this.state.userId)
            .then(result => {
                if (result.errors) {
                    this.setState({error: true});

                }
                else {
                    this.setState({
                        selectedIncome: null
                    });
                    this.handleDisableModal();
                    if (this.props.typeChange){
                        this.handleAlert();
                    } else {
                        this.props.stateChange(true);
                    }
                    
                }
            })
        }
    }

    handleAlert(){
        this.props.typeChange('income');
        this.props.stateChange(true);
    }

    validateForm() {
        let v_income = this.state.selectedIncome;
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
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Income</Button>
                        <AddIncomeModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedincome = {this.state.selectedIncome}
                            errors = {this.state.errors}
                            datechange = {this.handleDateChange}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddIncome;
