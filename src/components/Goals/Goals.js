import React, { Component } from 'react';
import { Row, Container } from 'react-bootstrap';

import { getFromStorage } from '../Storage';
import GoalBar from './GoalBar';
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
        this.rerender = this.rerender.bind(this);
    }

    UNSAFE_componentWillReceiveProps(render) {
        if (this.props.render) {
            this.componentDidMount();
        }
    }

    rerender(val) {
        this.setState( {render: val} )
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
        this.setState({selectedGoal:goal, render: false});
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
    }

    handleDisableModal() {
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
            await goalAPI  
            .update(this.state.selectedGoal)
            .then(result => {
                if (result.errors) {
                    this.setState({errors: {"goalError": "Goal already exists, please update existing goal."}});
                }
                else {
                    this.setState({
                        selectedGoal: null,
                        render: true,
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
                <Row>
                    {(this.state.allGoals).map(goal => {
                        return <GoalBar
                        goal={goal}
                        key={goal._id}
                        onSelect={this.handleSelect}
                        rerender = {this.state.render}
                        onDelete={this.handleDelete}
                        stateChange = {this.rerender}
                        />
                    })}
                </Row>
            </Container>
        </div>
        );
    }
}
export default Goals;