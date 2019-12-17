import React, { Component } from 'react';
import { Row, Col, Container, Toast, Figure } from 'react-bootstrap';
import NavBar from './Navbar';
import AddExpense from './Transactions/Expense/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
import { getFromStorage } from './Storage';
import usersAPI from '../api/userAPI';
import transactionAPI from '../api/transactionAPI';
// import Totals from './Totals';
import Graph from './Graph/Graph';
import GoalInfo from './Goals/GoalInfo';
import Logo from '../assets/expense-elephant-logo.png';


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
            incomeTotal: ''
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
                    this.total();

                    transactionAPI.getSpendingTotal(this.state.userId).then(json => {
                        if (json[0]){
                            this.setState({spendingTotal: ((json[0].spendingTotal)/100).toFixed(2)});
                        } else {
                            this.setState({spendingTotal: 0});
                        }
                    });
                    transactionAPI.getIncomeTotal(this.state.userId).then(json => {
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

    total() {
        transactionAPI.getSpendingTotal(this.state.userId).then(spendTotal => {
            if(spendTotal[0]) {
                this.setState({spentTotal: (spendTotal[0].spendingTotal/100).toFixed(2)})
            } else {
                this.setState({spentTotal: 0})
            }
            
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
                            
                            {/* <img src={Logo} className="rounded mr-2" alt="" /> */}
                            {/* <img src="../assets/expense-elephant-logo.png" className="rounded mr-2" alt="" /> */}
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
                        <h3 className="dashboard-title">Welcome back, {this.state.fullName}!</h3>
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
                    <Row>
                        <h5>For this period, you have done the following:</h5>
                    </Row>
                    <Row>
                        <Col>
                            <h6>Spent ${this.state.spendingTotal}</h6>
                        </Col>
                        <Col>
                            <h6>Earned ${this.state.incomeTotal}</h6>
                        </Col>
                    </Row>
                    
                    <Row style={{ marginTop: 85 }}>
                        <Col>
                            <Graph render = {this.state.render} />
                        </Col>
                        <Col>
                            <h3>Monthly Breakdown</h3>
                            {/* <Totals render={this.state.render} /> */}
                            {/* <GoalInfo
                                render={this.state.render}
                            /> */}
                            {/* <Goals
                                render = {this.state.render}
                                stateChange = {this.rerender} 
                            /> */}
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