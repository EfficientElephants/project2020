import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';

import AddGoalModal from './AddGoalModal';
import goalAPI from '../../api/goalAPI';
import transactionAPI from '../../api/transactionAPI'
import { getFromStorage } from '../Storage';

class AddGoal extends Component {
    constructor(props) {
        super();
        this.state = {
            userId: '',
            errors: {},
            showModal: false, 
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
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
    }

    handleChange(event) {
        let selectedGoal = this.state.selectedGoal;
        selectedGoal[event.target.name] = event.target.value;
        this.setState({ selectedGoal: selectedGoal });

    }

    handleCancel() {
        this.setState({ selectedGoal: null, showModal: false });
        this.handleDisableModal();

    }

    handleEnableModal () {
        this.setState({
            showModal: true,
            selectedGoal: {category: '', goalAmount: ''}
        });     
    }

    handleDisableModal() {
        this.setState({
            showModal: false,
            selectedGoal: null
        })
    }

    async handleSave(event) {
        event.preventDefault();

        if (this.validateForm()) {
            var spent = await (transactionAPI.getTotalsAll(this.state.userId)
            .then(allTotals => {
                allTotals.forEach(function(item){
                    item.totals = ((item.totals/100).toFixed(2));
                })
                var total = 0;
                allTotals.forEach((element) => {
                    if (element._id === this.state.selectedGoal.category) {
                        total = element.totals;
                    }
                });
                return total
            }));
            this.state.selectedGoal.spentAmount = spent;
            goalAPI  
            .create(this.state.selectedGoal, this.state.userId)
            .then(result => {
                if (result.errors) {
                    this.setState({errors: {"goalError": "Goal already exists, please update existing goal."}});
                }
                else {
                    this.setState({
                        selectedGoal: null, 
                        alertOpen: true
                    });
                    this.handleDisableModal();
                    this.props.stateChange(true);
                }
            })
        }
    }

    validateForm() {
        let v_goal = this.state.selectedGoal;
        let errors = {};
        let formIsValid = true;

        if (!v_goal.goalAmount) {
            formIsValid = false;
            errors["goalAmount"] = "Please enter a valid amount.";
        }

        if (v_goal.goalAmount !== "") {
            //regular expression for price validation
            var pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
            if (!pattern.test(v_goal.goalAmount)) {
                formIsValid = false;
                errors["goalAmount"] = "Please enter a valid non-negative amount";
            }
        }

        if (!v_goal.category) {
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
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Goal</Button>
                        <AddGoalModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedgoal = {this.state.selectedGoal}
                            errors = {this.state.errors}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddGoal;
