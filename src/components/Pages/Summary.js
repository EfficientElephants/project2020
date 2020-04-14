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
          <br />
          <h1>Summary</h1>
          <Card body>
            <p>
              Once you start creating goals, it&apos;s helpful to see how they&apos;ve been working!
              Use this page to see how on track you&apos;ve been,
              so you can adjust your sights for the future.
            </p>
          </Card>
          <br />
          {(this.state.totalSpent === 0 &&
          this.state.totalEarned === 0 &&
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
                  Since your first transaction in
                  {' '}
                  {dateformat(this.state.earliestTransaction, 'mmm yyyy')}
                  ...
                </h4>
                <Row>
                  <Col>
                    <Card body>
                      You spend an average of
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
                      You earn an average of
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
              </div>
            )
          )}


          <h4>
            Since your first transaction in
            {' '}
            {dateformat(this.state.earliestTransaction, 'mmm yyyy')}
            ...
          </h4>
          <br />
          <br />
          <Row>
            <Col>
              <Row style={{ paddingLeft: '15px' }}>
                You&apos;ve Spent: $
                {this.state.totalSpent}
              </Row>
              <Row style={{ paddingLeft: '15px' }}>
                You&apos;ve Earned: $
                {this.state.totalEarned}
              </Row>

            </Col>
            <Col>
              <Row style={{ paddingLeft: '15px' }}>
                How are the goals that you&apos;ve set working out?
              </Row>
              <br />
              <div>
                <Accordion>
                  {(this.state.cards === null) ?
                    null :
                    // eslint-disable-next-line no-return-assign
                    (this.state.cards.map((card) =>
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
