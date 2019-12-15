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

    rerender(val) {
        this.setState({render: val})
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
                    <h3 class="dashboard-title">Welcome back, {this.state.fullName}!</h3>
                    <br />
                    <Row>
                        <Col>
                            <h3>Spending Status</h3>
                            <Row>
                                <Col md={6}>
                                    <p>A graph of spending status will go here later.</p>
                                    <Graph spentTotal = {this.state.spentTotal} />
                                    <Totals />
                                </Col>
                                <Col>
                                    <AddExpense 
                                        typeChange = {this.handleChange} 
                                    />
                                </Col>
                                <Col>
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