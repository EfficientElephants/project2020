import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import NavBar from '../Navbar';

class IncomeManager extends Component {

    render() {
      return (
        <div>
        <NavBar />
        <Container>
            <br />
            <h1>Log Your Income</h1>
            <br />
            <p>Manage all income logging here!</p>
        </Container>
        </div>
      );
    }
  }
  
  export default IncomeManager;