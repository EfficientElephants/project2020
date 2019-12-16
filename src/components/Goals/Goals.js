import React, { Component } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';

import { getFromStorage } from '../Storage';
import GoalBar from './GoalBar';
import AddGoalModal from './AddGoalModal';
import EditGoalModal from './EditGoalModal';
import goalAPI from '../../api/goalAPI';
import transactionAPI from '../../api/transactionAPI'

class Goals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            allGoals: [],
            errors: {},
            showModal: false, 
            render: false

        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps(render) {
        if (this.props.render) {
            goalAPI.get(this.state.userId).then(json => this.setState({
                allGoals:json
            }))
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
                    this.setState({ userId: json.userId, error: false })
                    goalAPI.get(this.state.userId).then(json => {
                        console.log(json);
                        this.setState({allGoals: json})
                    }); 
                } else {
                    // handle error
                    console.log('not working');
                }
            })   
        }
    }

    handleSelect(goal) {
        this.setState({selectedGoal:goal});
        this.handleEnableModal(goal);
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

    handleEnableModal (goal) {
        this.setState({
            showModal: true,
            // selectedGoal: {category: '', goalAmount: ''}
        });
        console.log("enabling");
        console.log(this.state.showModal);
        
    }

    handleDisableModal() {
        console.log("disabling");
        this.setState({
            showModal: false,
            selectedGoal: null
        })
    }

    handleDelete(event, goal) {
        event.stopPropagation();
        goalAPI.destroy(goal).then(() => {
            let goals = this.state.allGoals;
            goals = goals.filter(h => h !== goal);
            this.setState({ allGoals: goals });
    
            if (this.selectedgoal === goal) {
                this.setState({ selectedGoal: null });
            }
        });
    }



    async handleSave(event) {
        console.log(event.currentTarget);
        event.preventDefault();

        if (this.validateForm()) {
            console.log("Saving", this.state.selectedGoal);

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
            await goalAPI  
            .update(this.state.selectedGoal)
            .then(result => {
                if (result.errors) {
                    console.log(result);
                    this.setState({errors: {"goalError": "Goal already exists, please update existing goal."}});
                }
                else {
                    console.log('Successfully created!');
                    this.setState({
                        selectedGoal: null, 
                        render: true
                    });
                    this.handleDisableModal();
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
        <div>
            <Container>
                <Row>
                    <div>
                        <EditGoalModal 
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
                {console.log("GOALS", this.state.render)}
                <Row>
                    {(this.state.allGoals).map(total => {
                        return <GoalBar
                        goal={total}
                        key={total._id}
                        onSelect={this.handleSelect}
                        rerender = {this.state.render}
                        onDelete={this.handleDelete}
                        />
                    })}
                </Row>
            </Container>
        </div>
        );
    }
}
export default Goals;