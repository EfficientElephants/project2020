import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

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
            <TransactionTable />
          </Container>
        </div>
      );
    }
  }
  
  export default Transactions;