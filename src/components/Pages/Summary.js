/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
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
import SummaryGraph from '../Graphs/SummaryGraph';

const dateformat = require('dateformat');

class Summary extends Component {
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
    for (const catIdx in this.state.disCats) {
      const card = {};
      card.category = this.state.disCats[catIdx];
      card.totalSpent = 0;
      for (const idx in this.state.allCatTotals) {
        if (card.category === this.state.allCatTotals[idx]._id) {
          card.totalSpent = ((this.state.allCatTotals[idx].totals) / 100).toFixed(2);
        }
      }
      card.timeswithGoal = 0;
      card.timesmetGoal = 0;
      for (const allIdx in this.state.allGoalsEver) {
        if (card.category === this.state.allGoalsEver[allIdx].category) {
          card.timeswithGoal += 1;
          if (this.state.allGoalsEver[allIdx].metGoal === true) {
            card.timesmetGoal += 1;
          }
        }
      }
      cards.push(card);
    }
    cards = this.cardLogic(cards);
    return cards;
  }

  cardLogic(cards) {
    for (const i in cards) {
      const card = cards[i];
      card.percent_metGoal = (card.timesmetGoal / card.timeswithGoal) * 100;
      card.timesOverGoal = card.timeswithGoal - card.timesmetGoal;
    }
    return cards;
  }

  createAccordian(card, key) {
    return (
      <Card key={key}>
        <Accordion.Toggle className="text-center" as={Card.Header} eventKey={key}>
          <h5>{card.category}</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={key}>
          <Card.Body>
            <Row>
              <Col>
                <p>
                  You&apos;ve had this goal for
                  {' '}
                  {card.timeswithGoal}
                  {' '}
                  months
                </p>
                <p>
                  You&apos;ve gone over
                  {' '}
                  {card.timesOverGoal}
                  {' '}
                  months
                </p>
                <p>
                  You spend an average of $
                  {(this.monthsDiff() === 0 ? card.totalSpent :
                    (card.totalSpent / this.monthsDiff()).toFixed(2))}
                  {' '}
                  per month
                </p>
              </Col>
              <Col>
                <p>How often do you meet your goal?</p>
                <SummaryGraph
                  percentage={card.percent_metGoal}
                />
              </Col>
            </Row>
            {/* <p>
              {card.percent_metGoal}
              % of the time you meet your goal
            </p>
           */}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  monthsDiff() {
    const today = new Date();
    const earliest = new Date(this.state.earliestTransaction);
    const yearsDiff = today.getFullYear() - today.getFullYear();
    const months = (yearsDiff * 12) + (today.getMonth() - earliest.getMonth());
    return months;
  }

  render() {
    this.monthsDiff();
    let key = -1;
    return (
      <div>
        <NavBar />
        <Container>
          <Row>
            <Col>
              <h1 className="header">
                Summary
              </h1>
            </Col>
          </Row>

          <Row>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>
                  Once you start creating goals, it&apos;s helpful to see how they&apos;ve been working!
                  Use this page to see how on track you&apos;ve been,
                  so you can adjust your sights for the future.
                </Card.Title>
              </Card.Body>
            </Card>
          </Row>
          <br />

          {(this.state.totalSpent === '0.00' &&
          this.state.totalEarned === '0.00' &&
          this.state.allGoalsEver.length === 0 ?
            (
              <div>
                <Card border="danger">
                  <Card.Header style={{ 'background-color': '#B22222' }} as="h5" />
                  <Card.Body>
                    <Card.Text>Check back here when you add goals and transactions!</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ) : (
              <div>
                <h4>
                  <strong>
                    Based on data from your first transaction in
                    {' '}
                    {dateformat(this.state.earliestTransaction, 'mmmm yyyy')}
                    ...
                  </strong>
                </h4>
                <br />
                <Row>
                  <Col>
                    <Card body>
                      You
                      {' '}
                      <strong>spend</strong>
                      {' '}
                      an average of
                      {' '}
                      <b>
                        $
                        {(this.monthsDiff() === 0 ? this.state.totalSpent :
                          (this.state.totalSpent / this.monthsDiff()).toFixed(2))}
                      </b>
                      {' '}
                      per month.
                    </Card>
                  </Col>
                  <Col>
                    <Card body>
                      You
                      {' '}
                      <strong>earn</strong>
                      {' '}
                      an average of
                      {' '}
                      <b>
                        $
                        {(this.monthsDiff() === 0 ? this.state.totalEarned :
                          (this.state.totalEarned / this.monthsDiff()).toFixed(2))}
                      </b>
                      {' '}
                      per month.
                    </Card>
                  </Col>
                </Row>
                <br />
                <div>
                  {this.state.allGoalsEver.length === 0 ?
                    (
                      <Card border="warning">
                        <Card.Header style={{ 'background-color': '#ffc107' }} as="h5">No Goals!</Card.Header>
                        <Card.Body>
                          <Card.Text>Create goals to get a breakdown of your spending habits.</Card.Text>
                        </Card.Body>
                      </Card>
                    ) : (
                      <div>
                        <p>
                          How are the goals that you&apos;ve set working out?
                        </p>
                        <div>
                          <Accordion>
                            {(this.state.cards === null) ?
                              null :
                            // eslint-disable-next-line no-return-assign
                              (this.state.cards.map((card) =>
                                this.createAccordian(card, key += 1)))}
                          </Accordion>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          <br />
          <br />
        </Container>
      </div>
    );
  }
}

export default Summary;
