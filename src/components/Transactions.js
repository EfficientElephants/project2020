import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

import Expenses from './Transaction/Expenses';
import NavBar from './Navbar';

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
            <Expenses />
          </Container>
        </div>
      );
    }
  }
  
  export default Transactions;