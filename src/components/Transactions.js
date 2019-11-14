import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';

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
            
            {/* This table will be a component we can pull in later? Responsive from DB. */}
            <Table responsive striped bordered>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Subject</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </div>
      );
    }
  }
  
  export default Transactions;