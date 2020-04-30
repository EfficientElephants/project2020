/* eslint-disable max-len */
import React, {
  Component
} from 'react';
import {
  Container, Row, Col, Card
} from 'react-bootstrap';
import AddExpense from '../Transactions/Expense/AddExpense';
import AddIncome from '../Transactions/Income/AddIncome';
import TransactionTable from '../Transactions/TransactionTable';
import NavBar from '../Navbar';

// add code to pull things from db--model after User.js?

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      render: false
    };
    this.rerender = this.rerender.bind(this);
  }

  rerender(val) {
    this.setState({ render: val });
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row>
            <Col>
              <h1 className="header">
                Transactions
              </h1>
            </Col>
          </Row>

          <Row>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>
                  All your transactions in one place. Modify, delete, and keep track of your spending habits.
                </Card.Title>
              </Card.Body>
            </Card>
          </Row>
          <br />

          <Row>
            <Col>
              <AddExpense stateChange={this.rerender} />
            </Col>
            <Col>
              <AddIncome stateChange={this.rerender} />
            </Col>
          </Row>
          <br />
          <Row>
            <TransactionTable
              stateChange={this.rerender}
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
