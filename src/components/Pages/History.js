import React, {
  Component
} from 'react';
import {
  Row, Col, Container, ButtonToolbar, Card, CardDeck
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

import {
  getFromStorage
} from '../Storage';
import NavBar from '../Navbar';


import usersAPI from '../../api/userAPI';
// import transactionAPI from '../api/transactionAPI';
import goalAPI from '../../api/goalAPI';

// import AddExpense from './Transactions/Expense/AddExpense';
// import AddIncome from './Transactions/Income/AddIncome';
import Graph from '../Graphs/Graph';
import GoalBar from '../Goals/GoalBar';
// import Logo from '../assets/expense-elephant-logo2.png';
import TransactionTable from '../Transactions/TransactionTable';

const dateformat = require('dateformat');
const moment = require('moment');

class History extends Component {
  constructor() {
    super();
    // var commonMoment = moment();
    this.state = {
      userId: '',
      fullName: '',
      // alertOpen: false,
      // alertType: "",
      // toastShow: false,
      // render: false,
      goalList: [],
      monthYearDisplay: dateformat(moment().subtract(1, 'month').toDate(), 'mmmm yyyy'),
      date: moment().subtract(1, 'month').toDate(),
      mmyyID: dateformat(moment().subtract(1, 'month').toDate(), 'mmyy'),
      maxDate: moment().subtract(1, 'month').toDate(),
      // render: true

    };
    this.handleDateChange = this.handleDateChange.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.rerender = this.rerender.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClick = this.rightClick.bind(this);
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
            this.getFullName();
            this.setState({ mmyyID: dateformat(this.state.date, 'mmyy') });
            goalAPI.get({ userId: this.state.userId, mmyyID: this.state.mmyyID })
              .then((jsonres) =>
                this.setState({ goalList: jsonres }));
          }
        });
    }
  }

  getFullName() {
    usersAPI.get(this.state.userId)
      .then((results) => {
        this.setState({ fullName: `${results.firstName} ${results.lastName}` });
      });
    return this.state.fullName;
  }

  handleDateChange(val) {
    this.setState({ date: val, mmyyID: dateformat(val, 'mmyy'), monthYearDisplay: dateformat(val, 'mmmm yyyy') });
    this.rerender(true);
  }

  rerender(val) {
    this.setState({ render: val, goalList: [] });
    this.componentDidMount();
  }

  leftClick() {
    const newDate = moment(this.state.date).subtract(1, 'month').toDate();
    this.handleDateChange(newDate);
  }

  rightClick() {
    if (dateformat(this.state.maxDate, 'mmyy') !== dateformat(this.state.date, 'mmyy')) {
      const newDate = moment(this.state.date).add(1, 'month').toDate();
      this.handleDateChange(newDate);
    }
  }


  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row>
            <Col>
              <h1 className="header">
                Historical Data for
                {' '}
                {this.state.monthYearDisplay}
              </h1>
            </Col>
          </Row>

          <Row>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>
                  View transactions, goals, and spending breakdowns for a selected month.
                </Card.Title>
                <br />
                <Row>
                  <Col>
                    <ButtonToolbar className="fa-pull-right">
                      <FontAwesomeIcon style={{ padding: '5px', color: '#00AD79' }} size="3x" icon={faArrowLeft} onClick={this.leftClick} />
                    </ButtonToolbar>
                  </Col>
                  <Col>
                    <DatePicker
                      showPopperArrow={false}
                      selected={this.state.date}
                      maxDate={this.state.maxDate}
                      onChange={(date) =>
                        this.handleDateChange(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                    />
                  </Col>
                  <Col>
                    <ButtonToolbar>
                      <FontAwesomeIcon style={{ padding: '5px', color: '#00AD79' }} size="3x" icon={faArrowRight} onClick={this.rightClick} />
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          <br />

          <Row style={{ marginTop: 30 }}>
            <CardDeck style={{ width: '100%' }}>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Spending Breakdown</h2>
                  <Card.Text className="center">See how you spent your money during this month.</Card.Text>
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
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Goal Progress</h2>
                  <Card.Text className="center">Did you meet your goals?</Card.Text>
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
            </CardDeck>
          </Row>
          <br />
          <br />

          <Row>
            <CardDeck style={{ width: '100%' }}>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Transactions</h2>
                  <Row>
                    <TransactionTable
                      render={this.state.render}
                      dates={this.state.mmyyID}
                      stateChange={this.rerender}
                    />
                  </Row>
                </Card.Body>
              </Card>
            </CardDeck>
          </Row>
          <br />
          <br />
        </Container>
      </div>
    );
  }
}

export default History;
