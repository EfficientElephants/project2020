import React, {
  Component
} from 'react';
import {
  Row, Col, Container, Toast, Figure, Card, CardDeck
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
const moment = require('moment');

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      firstName: '',
      alertOpen: false,
      alertType: '',
      toastShow: false,
      render: false,
      spendingTotal: '',
      incomeTotal: '',
      goalList: [],
      monthYearDisplay: dateformat(moment().toDate(), 'mmmm yyyy'),
      mmyyID: dateformat(new Date(), 'mmyy')
    };
    this.handleChange = this.handleChange.bind(this);
    this.rerender = this.rerender.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({ userId: json.userId });
            this.getFirstName();

            goalAPI.get({ userId: this.state.userId, mmyyID: this.state.mmyyID }).then((jsonres) =>
              this.setState({ goalList: jsonres }));

            transactionAPI.getSpendingTotal(this.state.userId, this.state.mmyyID)
              .then((jsonres2) => {
                if (jsonres2[0]) {
                  this.setState({ spendingTotal: ((jsonres2[0].spendingTotal) / 100).toFixed(2) });
                } else {
                  this.setState({ spendingTotal: 0 });
                }
              });
            transactionAPI.getIncomeTotal(this.state.userId, this.state.mmyyID).then((jsonres3) => {
              if (jsonres3[0]) {
                this.setState({ incomeTotal: ((jsonres3[0].incomeTotal) / 100).toFixed(2) });
              } else {
                this.setState({ incomeTotal: 0 });
              }
            });
          }
        });
    }
  }

  getFirstName() {
    usersAPI.get(this.state.userId)
      .then((results) => {
        this.setState({ firstName: `${results.firstName}` });
      });
    return this.state.firstName;
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
    if (this.state.alertOpen) {
      return (
        <div>
          <Toast
            style={{
              position: 'absolute',
              top: '6%',
              right: '2%',
              background: 'white'
            }}
            show={this.state.toastShow}
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
            <Toast.Body>{this.state.alertType === 'expense' ? 'Sucessfully Added Expense.' : 'Sucessfully Added Income.' }</Toast.Body>
          </Toast>
        </div>
      );
    }
    return <div />;
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row className="dashboard-header">
            <Col md={{ span: 6, offset: 3 }}>
              <h1 className="dashboard-title">
                Welcome
                {' '}
                {this.state.firstName}
                !
              </h1>
            </Col>
          </Row>
          <Row>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>This page allows you to keep track of your current monthly expenses and your 
                  overall progress on your goals. Don't forget to log your transactions below!
                </Card.Title>
                <Card.Text>
                  <center><strong>
                    In {this.state.monthYearDisplay}, you've spent a total of ${this.state.spendingTotal} and earned a total of ${this.state.incomeTotal}.
                  </strong></center>
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <br/>

          <Row>
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

          <Row style={{ marginTop: 30 }}>
            <Col>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Spending Breakdown</h2>
                  <Card.Text><center>See how you're spending your money this month.</center></Card.Text>
                  {(this.state.spendingTotal !== 0) ?
                  (
                    <Graph
                      date={this.state.mmyyID}
                      render={this.state.render}
                    />
                  ) :
                  (null)}
                </Card.Body>
              </Card>
              </Col>
              <Col>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Goal Progress</h2>
                  <Card.Text><center>Are you on track to meet your goals?</center></Card.Text>
                  {/* { (this.state.goalList.length === 0) ? (
                    <p>You currently have no goals set up.</p>    
                ) : */}
                  {this.state.goalList.map((goal) =>
                    (
                      <GoalBar
                        goal={goal}
                        key={goal._id}
                        render={this.state.render}
                      />
                    ))}
                </Card.Body>
              </Card>
              </Col>
          </Row>
          
          {this.createAlert()}
        </Container>
      </div>
    );
  }
}

export default Dashboard;
