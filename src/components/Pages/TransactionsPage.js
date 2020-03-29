import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddExpense from '../Transactions/Expense/AddExpense';
import AddIncome from '../Transactions/Income/AddIncome';
import TransactionTable from '../Transactions/TransactionTable';
import NavBar from '../Navbar';

//add code to pull things from db--model after User.js?

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      render: false
    }
    this.rerender = this.rerender.bind(this);
  }

  rerender(val) {
    this.setState( {render: val} )
    this.forceUpdate();
  }
    render() {
      return (
        <div>
          <NavBar />
          <Container>
            <br />
            <h1>Your Transactions</h1>
            <br />
            <Row>
              <Col>
                <AddExpense stateChange = {this.rerender} />
              </Col>
              <Col>
                <AddIncome stateChange = {this.rerender} />
              </Col>
            </Row>
            <br />
            <Row>
              <TransactionTable 
                stateChange = {this.rerender}
                render={this.state.render}
                dates="all"
              />
            </Row>
          </Container>
        </div>
      );
    }
  }
  
  export default Transactions;