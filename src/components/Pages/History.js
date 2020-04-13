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
    const newDate = moment(this.state.date).add(1, 'month').toDate();
    this.handleDateChange(newDate);
  }


  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row className="dashboard-header">
            <div className="col-5">
              <h1 className="dashboard-title">
                {this.state.fullName}
                &apos;s Historical Data for
                {' '}
                {this.state.monthYearDisplay}
              </h1>
            </div>
            <div className="col-5">
              <h6>Select a month</h6>
              <DatePicker
                showPopperArrow={false}
                selected={this.state.date}
                maxDate={this.state.maxDate}
                onChange={(date) =>
                  this.handleDateChange(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            <div className="col-2">
              <ButtonToolbar>
                <Button variant="secondary" onClick={this.leftClick}><h1>&lt;</h1></Button>
                  &nbsp;&nbsp;&nbsp;
                <Button variant="secondary" onClick={this.rightClick} disabled={dateformat(this.state.maxDate, 'mmyy') === dateformat(this.state.date, 'mmyy')}><h1>&gt;</h1></Button>
              </ButtonToolbar>
            </div>
          </Row>

          <Container>
            <Row>
              <Col>
                <Graph
                  date={this.state.mmyyID}
                  render={this.state.render}
                />
              </Col>
              <Col>
                <h2>Monthly Breakdown</h2>
                {this.state.goalList.map((goal) =>
                  (
                    <GoalBar
                      goal={goal}
                      key={goal._id}
                      render={this.state.render}
                    />
                  ))}
              </Col>
            </Row>
          </Container>
          <Container>
            <h2 style={{ paddingTop: '100px' }}>Transactions</h2>
            <Row>
              <TransactionTable
                render={this.state.render}
                dates={this.state.mmyyID}
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
