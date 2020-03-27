import React, { Component } from 'react';
import { Row, Col, Container, Toast, Figure } from 'react-bootstrap';
import NavBar from './Navbar';
import { getFromStorage } from './Storage';

import usersAPI from '../api/userAPI';
import transactionAPI from '../api/transactionAPI';
import goalAPI from '../api/goalAPI';

import AddExpense from './Transactions/Expense/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
import Graph from './Graph/Graph';
import GoalBar from './Goals/GoalBar';
import Logo from '../assets/expense-elephant-logo2.png';
var dateformat = require('dateformat');



class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            fullName: "",
            alertOpen: false,
            alertType: "", 
            toastShow: false,
            render: false,
            spendingTotal: '',
            incomeTotal: '',
            goalList: [],
            mmyyID: dateformat(new Date() , 'mmyy')
        }
        this.handleChange = this.handleChange.bind(this);
        this.rerender = this.rerender.bind(this);
    }

    componentDidMount() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    this.setState({ userId: json.userId })
                    this.getFullName();
            
                    
                    goalAPI.get({userId: this.state.userId, mmyyID: this.state.mmyyID}).then(json => this.setState({goalList:json}));
                    
                    transactionAPI.getSpendingTotal(this.state.userId, this.state.mmyyID).then(json => {
                        if (json[0]){
                            this.setState({spendingTotal: ((json[0].spendingTotal)/100).toFixed(2)});
                        } else {
                            this.setState({spendingTotal: 0});
                        }
                    });
                    transactionAPI.getIncomeTotal(this.state.userId, this.state.mmyyID).then(json => {
                        if (json[0]){
                            this.setState({incomeTotal: ((json[0].incomeTotal)/100).toFixed(2)});
                        } else {
                            this.setState({incomeTotal: 0});
                        }
                    });
                    
                } else {
                    // handle error
                    console.log('not working');
                }
            })
        }
    }

    getFullName() {
        usersAPI.get(this.state.userId)
            .then(results => {
                this.setState({fullName: results[0].firstName + " " + results[0].lastName});
            });
            
        return this.state.fullName;                          
    }

    handleChange(type) {
        this.setState({
            alertType: type,
            alertOpen: true,
            toastShow: true
        })
    }

    rerender(val) {
        this.setState( {render: val} )
        this.componentDidMount();
    }

    createAlert() {
        const toggleShow = () => this.setState({toastShow:false});
        if (this.state.alertOpen) {
            return (
                <div>
                    <Toast 
                        style={{
                            position: 'absolute',
                            top: '6%',
                            right: '2%',
                            background: "white"
                        }}
                        show={this.state.toastShow} 
                        onClose={toggleShow} 
                        delay={3000} 
                        autohide
                    >
                        <Toast.Header
                              style={{
                                background: "#DEDEDE",
                                color: "black"
                            }}
                        >
                            <Figure.Image
                                width={20}
                                height={20}
                                alt="Logo of an Elephant"
                                src={Logo}
                                className="rounded mr-2"
                            />
                            
                            <strong className="mr-auto">Expense Elephant</strong>
                        </Toast.Header>
                        <Toast.Body>{this.state.alertType==="expense" ? "Sucessfully Added Expense.": "Sucessfully Added Income." }</Toast.Body>
                    </Toast>
                </div>
            )
        } else {
            return <div></div>
        }
    }

    render() {
        return (
            <div>
                
                <NavBar />
                <Container>
                    <Row className="dashboard-header">
                        <Col md={7}>
                        <h1 class="dashboard-title">Welcome back, {this.state.fullName}!</h1>
                        </Col>
                        <Col>
                            <AddExpense 
                                typeChange = {this.handleChange}
                                stateChange = {this.rerender} 
                            />
                        </Col>
                        <Col>
                            <AddIncome 
                                typeChange = {this.handleChange}
                                stateChange = {this.rerender}
                            />
                        </Col>
                    </Row>
                    <br/>

                    <Container>
                        <Row>
                            <Col>
                                <h5>For this period, you have done the following:</h5>
                            </Col>
                            <Col>
                                <p><strong>Spent</strong> ${this.state.spendingTotal}</p>
                                <p><strong>Earned</strong> ${this.state.incomeTotal}</p>
                            </Col>
                        </Row>
                    </Container>
                    
                    <Row style={{ marginTop: 85 }}>
                        <Col>
                        {
                            <Graph 
                                date = {this.state.mmyyID}
                                render = {this.state.render} />
                        }
                            
                        </Col>
                        <Col>
                            <h3>Monthly Breakdown</h3>
                            {this.state.goalList.map(goal => {
                                return <GoalBar
                                    goal={goal}
                                    key={goal._id}
                                    render = {this.state.render}
                                />
                            })}
                        </Col>
                    </Row>
                    {/* <br />
                    <br />
                    <br /> */}
                    {/* <Row>
                        <Col>
                            <h3>Loan Tracker</h3>
                            <p>Student Debt</p>
                            <p>Car Payment</p>
                        </Col>
                       
                    </Row> */}
                    {this.createAlert()}
                </Container>
            </div>
        );
    }
}

export default Dashboard;