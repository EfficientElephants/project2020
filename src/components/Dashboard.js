import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from './Navbar';
//import PurchaseTransactions from './Transaction/NewStructure/PurchaseTransactions';
import AddExpense from './Transactions/AddExpense';
import { getFromStorage } from './Storage';
import usersAPI from '../api/userAPI';


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            fullName: "didn't change",
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
                } else {
                    // handle error
                    console.log('not working');
                }
            })
            
        }
        this.getFullName();
    }

    getFullName() {
        console.log(this.state.userId);
        console.log(this.state.fullName);
        usersAPI.get(this.state.userId)
            .then(results => {
                console.log(results[0]);
                this.setState({fullName: results[0].firstName + " " + results[0].lastName});
            });
        console.log(this.state.fullName);                           
        return this.state.userId;
    }

    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <br />
                    <h1>{this.state.fullName}'s Dashboard</h1>
                    <br />
                    <Row>
                        <Col>
                            <h3>Spending Status</h3>
                            <Row>
                                <Col>
                                    <p>A graph of spending status will go here later.</p>
                                </Col>
                                <Col>
                                    <AddExpense />
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