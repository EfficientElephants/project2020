import React, { Component } from 'react';
import { Row, Col, Container, Alert } from 'react-bootstrap';
import NavBar from './Navbar';
//import PurchaseTransactions from './Transaction/NewStructure/PurchaseTransactions';
import AddExpense from './Transactions/AddExpense';
import { getFromStorage } from './Storage';
import usersAPI from '../api/userAPI';
import Totals from './Totals';


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            fullName: "",
            alertOpen: false, 
        }
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
                console.log(results[0]);
                this.setState({fullName: results[0].firstName + " " + results[0].lastName});
            });
        return this.state.fullName;                          
    }

    successfullyCreatedAlert = (argument) => {
        if (argument) {
            this.setState({alertOpen: argument})
        }
    }

    createAlert() {
        if (this.state.alertOpen) {
            return (
                <Alert variant="success" onClose={() => this.setState({alertOpen: false})} dismissible >
                    <Alert.Heading>Successfully Created!</Alert.Heading>
                </Alert>
            )
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    {this.createAlert()}
                    <br />
                    <h1>{this.state.fullName}'s Dashboard</h1>
                    <br />
                    <Row>
                        <Col>
                            <h3>Spending Status</h3>
                            <Row>
                                <Col>
                                    <p>A graph of spending status will go here later.</p>
                                    <Totals />
                                </Col>
                                <Col>
                                    <AddExpense successfullyCreatedAlert = {this.successfullyCreatedAlert} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <h3>Loan Tracker</h3>
                            <p>Student Debt</p>
                            <p>Car Payment</p>
                        </Col>
                        <Col>
                            <h3>Expense Breakdown</h3>
                            <p>Rent</p>
                            <p>Food</p>
                            <p>Social</p>
                            <p>Medical</p>
                            <p>Transportation</p>
                            <p>Personal Care</p>
                        </Col>
                    </Row>
                </Container>
                {/* <PurchaseTransactions /> */}
            </div>
        );
    }
}

export default Dashboard;