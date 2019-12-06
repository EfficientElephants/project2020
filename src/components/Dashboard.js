import React, { Component } from 'react';
import { Row, Col, Container, Toast } from 'react-bootstrap';
import NavBar from './Navbar';
import AddExpense from './Transactions/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
import { getFromStorage } from './Storage';
import usersAPI from '../api/userAPI';
import Totals from './Totals';
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

    handleChange(type) {
        console.log(type);
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
        console.log(this.state.alertOpen);
        console.log(this.state.alertType);
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
                            <Totals />
                            <Goals />
                        </Col>
                    </Row>
                    {this.createAlert()}

                    <AddGoal />
                </Container>
            </div>
        );
    }
}

export default Dashboard;