/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Container, Table
} from 'react-bootstrap';
import transactionAPI from '../api/transactionAPI';
import {
  getFromStorage
} from './Storage';

const dateformat = require('dateformat');

class Totals extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      allTotals: [],

    };
  }

  async componentDidMount() {
    // query for all of the logged in users transactions
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      await fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({ userId: json.userId, error: false });
            this.getTotalsAll();
          } else {
            // handle error
            console.log('not working');
          }
        });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(render) {
    if (this.props.render) {
      this.getTotalsAll();
    }
  }

  async getTotalsAll() {
    const resp = await (transactionAPI.getTotalsAll(this.state.userId, dateformat(new Date(), 'mmyy')).then((allTotals) => {
      allTotals.forEach((item) => {
        item.totals = ((item.totals / 100).toFixed(2));
      });
      return allTotals;
    }));
    const allTotals = resp;
    const totalArray = JSON.stringify(allTotals);
    this.setState({ allTotals: totalArray });
    return totalArray;
  }

  render() {
    return (
      <Container>
        <p>Totals</p>
        <div>{this.state.allTotals}</div>
        <Table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount Spent</th>
            </tr>
          </thead>
          {/* <tbody>
                        {this.state.allTotals.map(total => {
                            return <Totals
                                total={total}
                                key={total._id}
                                onSelect={this.handleSelect}
                                selectedTotal = {this.state.selectedTotal}
                                onDelete={this.handleDelete}
                            />
                        })}
                </tbody> */}
        </Table>
      </Container>
    );
  }
}
export default Totals;
