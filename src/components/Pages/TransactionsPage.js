import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddExpense from '../Transactions/AddExpense';
import AddIncome from '../Transactions/Income/AddIncome';
import TransactionTable from '../Transactions/TransactionTable';
import NavBar from '../Navbar';

//add code to pull things from db--model after User.js?

class Transactions extends Component {

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
                <AddExpense />
              </Col>
              <Col>
                <AddIncome />
              </Col>
            </Row>
            <TransactionTable />
          </Container>
        </div>
      );
    }
  }
  
  export default Transactions;