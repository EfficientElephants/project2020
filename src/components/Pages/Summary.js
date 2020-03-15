import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddExpense from '../Transactions/Expense/AddExpense';
import AddIncome from '../Transactions/Income/AddIncome';
import TransactionTable from '../Transactions/TransactionTable';
import NavBar from '../Navbar';

class Summary extends Component {
  constructor() {
    super();
    this.state = {
      
    }
    
  }
    render() {
      return (
        <div>
          <NavBar />
          <Container>
            <br />
            <h1>Your Summary</h1>
            <br />
          </Container>
        </div>
      );
    }
  }
  
  export default Summary;