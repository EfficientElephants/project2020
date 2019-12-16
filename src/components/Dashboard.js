import React, { Component } from 'react';
import { Row, Col, Container, Toast } from 'react-bootstrap';
import NavBar from './Navbar';
import AddExpense from './Transactions/Expense/AddExpense';
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

    rerender(val) {
        this.setState( {render: val} )
        this.forceUpdate();
    }

    createAlert() {
        const toggleShow = () => this.setState({toastShow:false});
        if (this.state.alertOpen) {
            return (
                <div>
                    <Toast 
                        style={{
                            position: 'absolute',
                            top: '5%',
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
                                        stateChange = {this.rerender} 
                                    />
                                    <AddIncome 
                                        typeChange = {this.handleChange}
                                        stateChange = {this.rerender}
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
                            <h3>Monthly Breakdown</h3>
                            {/* <Totals render={this.state.render} /> */}
                            <Goals 
                                render = {this.state.render}
                                stateChange = {this.rerender} 
                            />
                        </Col>
                    </Row>
                    {this.createAlert()}
                </Container>
            </div>
        );
    }
}

export default Dashboard;