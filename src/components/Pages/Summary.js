/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, {
  Component
} from 'react';
import {
  Row, Col, Container, Accordion, Card
} from 'react-bootstrap';
import NavBar from '../Navbar';
import {
  getFromStorage
} from '../Storage';
import goalAPI from '../../api/goalAPI';
import transactionAPI from '../../api/transactionAPI';

const dateformat = require('dateformat');

class Summary extends Component {
  static createAccordian(card, key) {
    return (
      <Card key={key}>
        <Accordion.Toggle as={Card.Header} eventKey={key}>
          <Row>
            <Col><h6>{card.category}</h6></Col>
            <Col>
              <h6>
                You&apos;ve Spent $
                {card.totalSpent}
              </h6>
            </Col>
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={key}>
          <Card.Body>
            <p>
              You&apos;ve had this goal for
              {card.timeswithGoal}
              {' '}
              months
            </p>
            <p>
              {card.percent_metGoal}
              % of the time you meet your goal
            </p>
            <p>
              You&apos;ve gone over
              {card.timesOverGoal}
              {' '}
              months
            </p>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  static cardLogic(cards) {
    cards.forEach((card) => {
      card.percent_metGoal = (card.timesmetGoal / card.timeswithGoal) * 100;
      card.timesOverGoal = card.timeswithGoal - card.timesmetGoal;
    });
    return cards;
  }


  constructor() {
    super();
    this.state = {
      disCats: [],
      allCatTotals: [],
      allGoalsEver: [],
      cards: null,
      earliestTransaction: new Date(),
      totalSpent: 0,
      totalEarned: 0,
    };
  }

  async componentDidMount() {
    const obj = getFromStorage('expense_app');
    await goalAPI.get({ userId: obj.token, mmyyID: 'all' })
      .then((json) => {
        this.setState({ allGoalsEver: json });
      });
    await goalAPI.getAllCategories(obj.token).then((json) => {
      this.setState({ disCats: json });
    });
    await transactionAPI.getTotalsAll(obj.token, 'all').then((json) => {
      this.setState({ allCatTotals: json });
    });

    const cards = this.createCards();
    this.setState({ cards });

    transactionAPI.earliestTransaction(obj.token).then((json) => {
      if (json[0] === undefined) {
        this.setState({ earliestTransaction: new Date() });
      } else {
        this.setState({ earliestTransaction: json[0].date });
      }
    });
    transactionAPI.getSpendingTotal(obj.token, 'all').then((json) => {
      if (json[0] === undefined) {
        this.setState({ totalSpent: (0).toFixed(2) });
      } else {
        this.setState({ totalSpent: (json[0].spendingTotal / 100).toFixed(2) });
      }
    });
    transactionAPI.getIncomeTotal(obj.token, 'all').then((json) => {
      if (json[0] === undefined) {
        this.setState({ totalEarned: (0).toFixed(2) });
      } else {
        this.setState({ totalEarned: (json[0].incomeTotal / 100).toFixed(2) });
      }
    });
  }

  createCards() {
    let cards = [];
    const { disCats, allCatTotals, allGoalsEver } = this.state;
    disCats.forEach((distinctCats) => {
      const card = {};
      card.category = distinctCats;
      card.totalSpent = 0;
      allCatTotals.forEach((catTotals) => {
        if (card.category === catTotals._id) {
          card.totalSpent = ((catTotals.totals) / 100).toFixed(2);
        }
      });
      card.timeswithGoal = 0;
      card.timesmetGoal = 0;
      allGoalsEver.forEach((goal) => {
        if (card.category === goal.category) {
          card.timeswithGoal += 1;
          if (goal.metGoal === true) {
            card.timesmetGoal += 1;
          }
        }
      });
      cards.push(card);
    });
    cards = this.cardLogic(cards);
    return cards;
  }


  render() {
    let key = -1;
    const { earliestTransaction, totalSpent, totalEarned, cards } = this.state;
    return (
      <div>
        <NavBar />
        <Container>
          <br />
          <h1>Your Summary</h1>
          <h4>
            Since your first transaction in
            {dateformat(earliestTransaction, 'mmm yyyy')}
            ...
          </h4>
          <br />
          <br />
          <Row>
            <Col>
              <Row style={{ paddingLeft: '15px' }}>
                You&apos;ve Spent: $
                {totalSpent}
              </Row>
              <Row style={{ paddingLeft: '15px' }}>
                You&apos;ve Earned: $
                {totalEarned}
              </Row>

            </Col>
            <Col>
              <Row style={{ paddingLeft: '15px' }}>
                How are the goals that you&apos;ve set working out?
              </Row>
              <br />
              <div>
                <Accordion>
                  {(cards === null) ?
                    null :
                    // eslint-disable-next-line no-return-assign
                    (cards.map((card) =>
                      this.createAccordian(card, key += 1)))}
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Summary;
