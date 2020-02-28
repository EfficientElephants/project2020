 import React, { Component } from 'react';
import goalAPI from '../../api/goalAPI';
import { getFromStorage } from '../Storage';
import { Row, Col, Container } from 'react-bootstrap';
import transactionAPI from '../../api/transactionAPI';
import EditGoalModal from './EditGoalModal';
import GoalInfo from './GoalInfo';
// var { ObjectId } = require('mongodb');

class Goals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            goalList: [],
            errors: {},
            showModal: false,
            render: false,
            // remaining: '',
            date: new Date(),
            mmyyID: '',
            month: '',
            year: '',
        }
        this.createArray = this.createArray.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    }

    UNSAFE_componentWillReceiveProps(render) {
        if (this.props.render) {
            goalAPI.get({
                userId: this.state.userId,
                mmyyID: this.state.mmyyID
            }).then(json => {
                console.log(json)
                this.setState({
                    goalList: json
                })
            });
        }
    }

    componentDidMount() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const {
                token
            } = obj;
            fetch('api/getUserId?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        var month = ((this.state.date.getMonth() + 1) < 10 ? '0' : '') + (this.state.date.getMonth() + 1)
                        var year = this.state.date.getFullYear() - 2000
                        var mmyyID = month + year

                        this.setState({
                            userId: json.userId,
                            mmyyID: mmyyID,
                            month: month,
                            year: year
                        })
                        goalAPI.get({userId: this.state.userId, mmyyID:this.state.mmyyID}).then(json => this.setState({goalList:json}));
                        console.log(this.state.oldID);
                        if (this.createNewDatabases()) {
                            console.log(this.state.oldID);
                            console.log(this.state.lastmonthGoals);
                        }

                    } else {
                        // handle error
                        console.log('not working');
                    }
                })
        }
    }

    async createNewDatabases() {
        console.log("here");
        if (this.state.date.getDate() === 18){ // && this.state.date.getMinutes === 25) {
            var oldMonth = ((this.state.month - 1) < 10 ? '0' : '') + (this.state.month - 1)
            var oldID = oldMonth + (this.state.year).toString()
            this.setState({
                oldID: oldID
            })
            console.log(this.state.oldID);
            var passing = {
                userId: this.state.userId,
                mmyyID: oldID
            }

            var oldGoals = goalAPI.get(passing);
            console.log(await oldGoals);
            var newGoals = await oldGoals;

            for (const goalIdx in newGoals) {
                var goal = {}
                goal.category = newGoals[goalIdx].category
                goal.goalAmount = newGoals[goalIdx].goalAmount
                goal.spentAmount = 0;
                console.log(goal);
                goalAPI.create(goal, this.state.userId);
            }
        }
    }

    handleSelect(goal) {
        this.setState({
            selectedGoal: goal,
            render: false
        });
        this.handleEnableModal(goal);
    }

    handleChange(event) {
        let selectedGoal = this.state.selectedGoal;
        selectedGoal[event.target.name] = event.target.value;
        this.setState({
            selectedGoal: selectedGoal
        });

    }

    handleCancel() {
        this.setState({
            selectedGoal: null,
            showModal: false
        });
        this.handleDisableModal();

    }

    handleEnableModal(goal) {
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
            this.setState({
                allGoals: goals
            });
            if (this.selectedgoal === goal) {
                this.setState({
                    selectedGoal: null
                });
            }
        });
    }

    async handleSave(event) {
        event.preventDefault();

        if (this.validateForm()) {
            var spent = await (transactionAPI.getTotalsAll(this.state.userId)
                .then(allTotals => {
                    allTotals.forEach(function (item) {
                        item.totals = ((item.totals / 100).toFixed(2));
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
                    this.setState({
                        selectedGoal: null,
                        render: true,
                    });
                    this.componentDidMount();
                })
            this.handleDisableModal();
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
        this.setState({
            errors: errors
        })
        return formIsValid
    }

    createArray() {
        let array = [];

        for (let i = 0; i < this.state.goalList.length; i = i + 2) {
            let subarray = [];
            subarray.push(this.state.goalList[i]);
            if (i + 1 < this.state.goalList.length) {
                subarray.push(this.state.goalList[i + 1]);
            } else {
                subarray.push([])
            }
            array.push(subarray);
        }
        return array
    }

    render() {
        return(
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
                    {this.createArray().map(array =>{
                        return (
                            <><Row>
                                {array.map((goal, i) => {
                                    if (goal.length === 0 && i%2 === 1){
                                        return <Col/>
                                    }
                                    return <GoalInfo
                                        goal={goal}
                                        key={goal._id}
                                        onSelect={this.handleSelect}
                                        rerender = {this.state.render}
                                        onDelete={this.handleDelete}
                                    />
                                })}
                            </Row>
                            <br /></>
                        )
                    })}
                </Container>
            </div>
        );
    }

}
export default Goals