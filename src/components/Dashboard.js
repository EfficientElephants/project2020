import React, { Component } from 'react';
import { Row, Col, Container, Toast } from 'react-bootstrap';
import NavBar from './Navbar';
import AddExpense from './Transactions/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
import { getFromStorage } from './Storage';
import usersAPI from '../api/userAPI';
import transactionAPI from '../api/transactionAPI';
import Totals from './Totals';
import Graph from './Graph/Graph';
import AddGoal from './Goals/AddGoal';
import Goals from './Goals/Goals';


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            fullName: "",
            alertOpen: false,
            alertType: "", 
            toastShow: false,
            render: false
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
                    console.log('here');
                    this.setState({ userId: json.userId })
                    this.getFullName();
                    this.total();
                } else {
                    // handle error
                    console.log('not working');
                }
            })
        }
    }

    total() {
        transactionAPI.getSpendingTotal(this.state.userId).then(spendTotal => {
            this.setState({spentTotal: (spendTotal[0].spendingTotal/100).toFixed(2)})
        })
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
    }

    createAlert() {
        const toggleShow = () => this.setState({toastShow:false});
        if (this.state.alertOpen) {
            return (
                    <Toast 
                        style={{
                            position: 'absolute',
                            top: '2%',
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
                            <img src="./../assets/expense-elephant-logo.png" className="rounded mr-2" alt="" />
                            <strong className="mr-auto">Expense Elephant</strong>
                        </Toast.Header>
                        <Toast.Body>{this.state.alertType==="expense" ? "Sucessfully Added Expense.": "Sucessfully Added Income." }</Toast.Body>
                    </Toast>
            )
        }
    }

    render() {
        return (
            <div>
                
                <NavBar />
                <Container>
                    <Row className="dashboard-header">
                        <Col md={7}>
                        <h3 class="dashboard-title">Welcome back, {this.state.fullName}!</h3>
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
                    
                    <Row>
                        <Col>
                            <Graph render = {this.state.render} />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <Row>
                        <Col>
                            <h3>Loan Tracker</h3>
                            <p>Student Debt</p>
                            <p>Car Payment</p>
                        </Col>
                        <Col>
                            <h3>Expense Breakdown</h3>
                            {/* <Totals render={this.state.render} />
                            <Goals render={this.state.render} /> */}
                        </Col>
                    </Row>
                    {this.createAlert()}

                    {/* <AddGoal /> */}
                </Container>
            </div>
        );
    }
}

export default Dashboard;