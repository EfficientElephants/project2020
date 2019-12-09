import React, { Component } from 'react';
import { Row, Col, Container, Toast } from 'react-bootstrap';
import NavBar from './Navbar';
import AddExpense from './Transactions/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
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
            alertType: "", 
            toastShow: false,
        }
        this.handleChange = this.handleChange.bind(this);
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

    closeToast(){
        this.setState({toastShow:false})
    }

    createAlert() {
        const toggleShow = () => this.setState({toastShow:false});
        if (this.state.alertOpen) {
            return (
                    <Toast 
                        style={{
                            position: 'absolute',
                            top: '2%',
                            right: 0,
                            background: "#5cb85c"
                        }}
                        show={this.state.toastShow} 
                        onClose={toggleShow} 
                        delay={3000} 
                        autohide
                    >
                        <Toast.Header
                              style={{
                                background: "#53a653",
                                color: "#282828"
                            }}
                        >
                            <strong className="mr-auto">Expense Elephant</strong>
                        </Toast.Header>
                        <Toast.Body>{this.state.alertType==="expense" ? "Sucessfully Added Expense": "Sucessfully Added Income" }</Toast.Body>
                    </Toast>
            )
        }
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
                                    <Totals />
                                </Col>
                                <Col>
                                    <AddExpense 
                                        typeChange = {this.handleChange} 
                                    />
                                    <AddIncome 
                                        typeChange = {this.handleChange}
                                    />
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
                    {this.createAlert()}
                </Container>
            </div>
        );
    }
}

export default Dashboard;