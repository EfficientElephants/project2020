import React, { Component } from 'react';
import goalAPI from '../../api/goalAPI';
import { getFromStorage } from '../Storage';
import { Row, Col, Container } from 'react-bootstrap';
import transactionAPI from '../../api/transactionAPI';
import EditGoalModal from './EditGoalModal';
import GoalInfo from './GoalInfo';
class Goals extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            goalList: [],
            errors: {},
            showModal: false,
            render: false
            // remaining: '',
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
            goalAPI.get(this.state.userId).then(json => this.setState({goalList:json}));
        }
    }

    componentDidMount(){
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    this.setState({ userId: json.userId })
                    goalAPI.get(this.state.userId).then(json => this.setState({goalList:json}));
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
        this.setState({errors: errors})
        return formIsValid
    }

    createArray() {
        let array = [];

        for(let i = 0; i < this.state.goalList.length; i = i + 2){
            let subarray = [];
            subarray.push(this.state.goalList[i]);
            if (i+1 < this.state.goalList.length){
                subarray.push(this.state.goalList[i+1]);
            }else {
                subarray.push([])
            }
            
            array.push(subarray);
            console.log(i)
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
                    {console.log(this.state.goalList.length)}
                    {console.log(this.createArray())}
                    {this.createArray().map(array =>{
                        return (
                            <><Row>
                                {array.map((goal, i) => {
                                    console.log(i%2);
                                    console.log(goal.length)
                                    if (goal.length ===0 && i%2 == 1){
                                        console.log("in blank");
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

                    
                    {/* {(this.state.goalList).map((goal, i) => {
                        if (i%2 === 0) {
                            return (
                                <Row>
                                    <GoalInfo
                                        goal={goal}
                                        key={goal._id}
                                        onSelect={this.handleSelect}
                                        rerender = {this.state.render}
                                        onDelete={this.handleDelete}
                                    />
                                </Row>
                            )
                        }else{
                            console.log(i);
                        }
                        
                    })}
                    <Row>
                        {(this.state.goalList).map(goal => {
                            return <GoalInfo
                            goal={goal}
                            key={goal._id}
                            onSelect={this.handleSelect}
                            rerender = {this.state.render}
                            onDelete={this.handleDelete}
                            />
                        })}
                    </Row> */}
                </Container>
            </div>
        );
    }

}
export default Goals