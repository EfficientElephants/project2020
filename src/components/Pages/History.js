/* eslint-disable no-underscore-dangle */
import React, {
  Component
} from 'react';
import {
  Row, Col, Container, Button, ButtonToolbar
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import NavBar from '../Navbar';
import {
  getFromStorage
} from '../Storage';


import usersAPI from '../../api/userAPI';
// import transactionAPI from '../api/transactionAPI';
import goalAPI from '../../api/goalAPI';

// import AddExpense from './Transactions/Expense/AddExpense';
// import AddIncome from './Transactions/Income/AddIncome';
import Graph from '../Graph/Graph';
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
    const { date, userId, mmyyID } = this.state;
    if (obj && obj.token) {
      const { token } = obj;
      fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({ userId: json.userId });
            this.getFullName();
            this.setState({ mmyyID: dateformat(date, 'mmyy') });
            goalAPI.get({ userId, mmyyID }).then((res) =>
              this.setState({ goalList: res }));
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

  handleDateChange(val) {
    this.setState({ date: val, mmyyID: dateformat(val, 'mmyy'), monthYearDisplay: dateformat(val, 'mmmm yyyy') });
    this.rerender(true);
  }

  rerender(val) {
    this.setState({ render: val, goalList: [] });
    this.componentDidMount();
  }

  leftClick() {
    const { date } = this.state;
    const newDate = moment(date).subtract(1, 'month').toDate();
    this.handleDateChange(newDate);
  }

  rightClick() {
    const { date } = this.state;
    const newDate = moment(date).add(1, 'month').toDate();
    this.handleDateChange(newDate);
  }


  render() {
    const { fullName, monthYearDisplay, date, maxDate, mmyyID, render, goalList } = this.state;
    return (
      <div>
        <NavBar />
        <Container>
          <Row className="dashboard-header">
            <div className="col-5">
              <h1 className="dashboard-title">
                {fullName}
                &apos;s Historical Data for
                {' '}
                {monthYearDisplay}
              </h1>
            </div>
            <div className="col-5">
              <h6> Select a month </h6>
              <DatePicker
                showPopperArrow={false}
                selected={date}
                maxDate={maxDate}
                onChange={(dateVal) =>
                  this.handleDateChange(dateVal)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            <div className="col-2">
              <ButtonToolbar>
                <Button variant="secondary" onClick={this.leftClick}><h1>&lt;</h1></Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="secondary" onClick={this.rightClick} disabled={dateformat(maxDate, 'mmyy') === dateformat(date, 'mmyy')}><h1>&gt;</h1></Button>
              </ButtonToolbar>
            </div>
          </Row>
          <Container>
            <Row>
              <Col>
                <Graph
                  date={mmyyID}
                  render={render}
                />
              </Col>
              <Col>
                <h2>Monthly Breakdown</h2>
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
          </Container>
          <Container>
            <h2 style={{ paddingTop: '100px' }}>Transactions</h2>
            <Row>
              <TransactionTable
                render={render}
                dates={mmyyID}
                stateChange={this.rerender}
              />
            </Row>
          </Container>
        </Container>
      </div>
    );
  }
}

export default History;
