/* eslint-disable no-underscore-dangle */
import React, {
  Component
} from 'react';
import {
  Row, Col, Container, Toast, Figure
} from 'react-bootstrap';
import NavBar from './Navbar';
import {
  getFromStorage
} from './Storage';

import usersAPI from '../api/userAPI';
import transactionAPI from '../api/transactionAPI';
import goalAPI from '../api/goalAPI';

import AddExpense from './Transactions/Expense/AddExpense';
import AddIncome from './Transactions/Income/AddIncome';
import Graph from './Graph/Graph';
import GoalBar from './Goals/GoalBar';
import Logo from '../assets/expense-elephant-logo2.png';

const dateformat = require('dateformat');


class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      fullName: '',
      alertOpen: false,
      alertType: '',
      toastShow: false,
      render: false,
      spendingTotal: '',
      incomeTotal: '',
      goalList: [],
      mmyyID: dateformat(new Date(), 'mmyy')
    };
    this.handleChange = this.handleChange.bind(this);
    this.rerender = this.rerender.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      const { userId, mmyyID } = this.state;
      fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({ userId: json.userId });
            this.getFullName();

            goalAPI.get({ userId, mmyyID }).then((resjson) =>
              this.setState({ goalList: resjson }));

            transactionAPI.getSpendingTotal(userId, mmyyID).then((resjson2) => {
              if (resjson2[0]) {
                this.setState({ spendingTotal: ((resjson2[0].spendingTotal) / 100).toFixed(2) });
              } else {
                this.setState({ spendingTotal: 0 });
              }
            });
            transactionAPI.getIncomeTotal(userId, mmyyID).then((resjson3) => {
              if (resjson3[0]) {
                this.setState({ incomeTotal: ((resjson3[0].incomeTotal) / 100).toFixed(2) });
              } else {
                this.setState({ incomeTotal: 0 });
              }
            });
          }
        });
    }
  }

  getFullName() {
    const { userId, fullName } = this.state;
    usersAPI.get(userId)
      .then((results) => {
        this.setState({ fullName: `${results.firstName} ${results.lastName}` });
      });
    return fullName;
  }

  handleChange(type) {
    this.setState({
      alertType: type,
      alertOpen: true,
      toastShow: true
    });
  }

  rerender(val) {
    this.setState({ render: val });
    this.componentDidMount();
  }

  createAlert() {
    const toggleShow = () =>
      this.setState({ toastShow: false });
    const { alertOpen, toastShow, alertType } = this.state;
    if (alertOpen) {
      return (
        <div>
          <Toast
            style={{
              position: 'absolute',
              top: '6%',
              right: '2%',
              background: 'white'
            }}
            show={toastShow}
            onClose={toggleShow}
            delay={3000}
            autohide
          >
            <Toast.Header
              style={{
                background: '#DEDEDE',
                color: 'black'
              }}
            >
              <Figure.Image
                width={20}
                height={20}
                alt="Logo of an Elephant"
                src={Logo}
                className="rounded mr-2"
              />
              <strong className="mr-auto">Expense Elephant</strong>
            </Toast.Header>
            <Toast.Body>{alertType === 'expense' ? 'Sucessfully Added Expense.' : 'Sucessfully Added Income.' }</Toast.Body>
          </Toast>
        </div>
      );
    }
    return <div />;
  }

  render() {
    const {
      fullName,
      spendingTotal,
      incomeTotal,
      mmyyID,
      render,
      goalList
    } = this.state;
    return (
      <div>
        <NavBar />
        <Container>
          <Row className="dashboard-header">
            <Col md={7}>
              <h1 className="dashboard-title">
                Welcome,
                {' '}
                {fullName}
                !
              </h1>
            </Col>
            <Col>
              <AddExpense
                typeChange={this.handleChange}
                stateChange={this.rerender}
              />
            </Col>
            <Col>
              <AddIncome
                typeChange={this.handleChange}
                stateChange={this.rerender}
              />
            </Col>
          </Row>
          <br />
          <Container>
            <Row>
              <Col>
                <h5>For this period, you have done the following:</h5>
              </Col>
              <Col>
                <p>
                  <strong>Spent</strong>
                  {' '}
                  $
                  {spendingTotal}
                </p>
                <p>
                  <strong>Earned</strong>
                  {' '}
                  $
                  {incomeTotal}
                </p>
              </Col>
            </Row>
          </Container>
          <Row style={{ marginTop: 85 }}>
            <Col>
              {(spendingTotal !== 0) ?
                (
                  <Graph
                    date={mmyyID}
                    render={render}
                  />
                ) :
                (null)}
            </Col>
            <Col>
              <h3>Monthly Breakdown</h3>
              {goalList.map((goal) =>
                (
                  <GoalBar
                    goal={goal}
                    key={goal._id}
                    render={render}
                  />
                ))}
            </Col>
          </Row>
          {this.createAlert()}
        </Container>
      </div>
    );
  }
}

export default Dashboard;
