import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import NavBar from './Navbar';

class Dashboard extends Component {

    render() {
      return (
        <div>
          <NavBar />
          <Container>
            <h1>Your Dashboard</h1>
            <br />
            <Row>
            <Col>
              <h3>Spending Status</h3>
                <Row>
                  <Col>
                    <p>A graph of spending status will go here later.</p>
                  </Col>
                  <Col>
                    <p>An explanation of spending status will go here too.</p>
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
          </Container>
        </div>
      );
    }
  }
  
  export default Dashboard;