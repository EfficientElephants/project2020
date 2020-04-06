import React, { Component } from 'react';
import { Row, Col, Container, Accordion, Card } from 'react-bootstrap';
import NavBar from '../Navbar';
import { getFromStorage } from '../Storage';
import goalAPI from '../../api/goalAPI'; 
import transactionAPI from '../../api/transactionAPI';
var dateformat = require('dateformat'); 

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
        }
    }
    /// Get all goals ever had (DONE);
    /// get all category totals ever
    /// see how many times in each goal you've either met or gone over



    async componentDidMount() {
        const obj = getFromStorage('expense_app');
        await goalAPI.get({userId: obj.token, mmyyID: 'all'})
            .then(json=> {
                this.setState({allGoalsEver: json})
            })
        await goalAPI.getAllCategories(obj.token).then(json => {
            this.setState({disCats: json});
        });
        await transactionAPI.getTotalsAll(obj.token, 'all').then(json => {
            this.setState({allCatTotals: json});
        });

        var cards = this.createCards();
        this.setState({cards: cards})

        transactionAPI.earliestTransaction(obj.token).then(json => {
            if(json[0] === undefined){
                this.setState({earliestTransaction: new Date()});
            }else{
                this.setState({earliestTransaction: json[0].date});
            }
        })
        transactionAPI.getSpendingTotal(obj.token, 'all').then(json => {
            if(json[0] === undefined){
                this.setState({totalSpent: (0).toFixed(2)})
            }else {
                this.setState({totalSpent: (json[0].spendingTotal/100).toFixed(2)})
            }
            
        })
        transactionAPI.getIncomeTotal(obj.token, 'all').then(json => {
            if(json[0] === undefined){
                this.setState({totalEarned: (0).toFixed(2)})
            }else {
                this.setState({totalEarned: (json[0].incomeTotal/100).toFixed(2)})
            }
        })
    }

    createCards() {
        var cards = [];
        for (var catIdx in this.state.disCats){
            var card = {};
            card.category = this.state.disCats[catIdx];
            card.totalSpent = 0;
            for (var idx in this.state.allCatTotals) {
                if (card.category === this.state.allCatTotals[idx]._id){
                    card.totalSpent = ((this.state.allCatTotals[idx].totals)/100).toFixed(2);
                }
            }
            card.timeswithGoal = 0;
            card.timesmetGoal = 0;
            for(var allIdx in this.state.allGoalsEver) {
                if(card.category === this.state.allGoalsEver[allIdx].category){
                    card.timeswithGoal += 1
                    if (this.state.allGoalsEver[allIdx].metGoal === true){
                        card.timesmetGoal += 1
                    }
                }
            }
            cards.push(card);
        }
        cards = this.cardLogic(cards);
        return cards
    }

    cardLogic (cards) {
        for (var i in cards){
            var card = cards[i];
            card.percent_metGoal = (card.timesmetGoal/card.timeswithGoal)*100
            card.timesOverGoal = card.timeswithGoal - card.timesmetGoal;
        }
        return cards
    }

    createAccordian(card, key){
        return <Card key={key}>
            <Accordion.Toggle as={Card.Header} eventKey={key}>
                <Row>
                    <Col><h6>{card.category}</h6></Col>
                    <Col><h6>You've Spent ${card.totalSpent}</h6></Col>
                </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={key}>
                    <Card.Body>
                        <p>You've had this goal for {card.timeswithGoal} months</p>
                        <p>{card.percent_metGoal}% of the time you meet your goal</p>
                        <p>You've gone over {card.timesOverGoal} months</p>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    }
    
    render() {
        var key = -1;
      return (
        <div>
            <NavBar />
            <Container>
                <br />
                <h1>Your Summary</h1>
                <h4>Since your first transaction in {dateformat(this.state.earliestTransaction, 'mmm yyyy')}...</h4>
                <br />
                <br />
                <Row>
                    <Col>
                        <Row style={{paddingLeft:"15px"}}>
                            You've Spent: ${this.state.totalSpent}
                        </Row>
                        <Row style={{paddingLeft:"15px"}}>
                            You've Earned: ${this.state.totalEarned}
                        </Row>
                        
                    </Col>
                    <Col>
                        <Row style={{paddingLeft:"15px"}}>
                            How are the goals that you've set working out?
                        </Row>
                        <br />
                        <div>
                            <Accordion>
                                {(this.state.cards === null)
                                    ? null
                                    : (this.state.cards.map(card => {
                                        return this.createAccordian(card, key += 1)
                                    }))
                                }
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