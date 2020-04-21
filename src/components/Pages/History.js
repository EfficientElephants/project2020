import React, {
  Component
} from 'react';
import {
  Row, Container, ButtonToolbar, Card, CardDeck
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import NavBar from '../Navbar';
import {
  getFromStorage
} from '../Storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


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
          <Row className="dashboard-header">
            <div className="col">
              <h1 className="dashboard-title" style={{textAlign:"center"}}>
                Historical Data for
                {' '}
                {this.state.monthYearDisplay}
              </h1>
              <p style={{textAlign:"center"}}>View transactions, goals, and spending breakdowns for a selected month.</p>
            </div>
          </Row>
          <Row>
            <div className="col-4">
            <ButtonToolbar className="fa-pull-right">
                <FontAwesomeIcon style={{padding:"5px"}} size='2x' icon={faArrowLeft} onClick={this.leftClick}/>
              </ButtonToolbar>
            </div>
            <div className="col-4">
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
            <div className="col-4">
              <ButtonToolbar>
                <FontAwesomeIcon style={{padding:"5px"}} size='2x' icon={faArrowRight} onClick={this.rightClick}/>
              </ButtonToolbar>
            </div>
          </Row>
          <br></br>
          <br></br>

          <Row style={{ marginTop: 30 }}>
            <CardDeck style={{ width: '100%' }}>
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
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <h2>Goal Progress</h2>
                  <Card.Text><center>Are you on track to meet your goals?</center></Card.Text>
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
          <br></br>
          <br></br>
          
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
          <br></br>
          <br></br>
        </Container>
      </div>
    );
  }
}

export default History;
