/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
import React, {
  Component
} from 'react';
import transactionAPI from '../../api/transactionAPI';
import {
  getFromStorage
} from '../Storage';


// eslint-disable-next-line import/no-named-as-default-member
import CanvasJSReact from '../../assets/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;
// var dateformat = require('dateformat');

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      catTotals: [],
      spentTotal: '',
      mmyyID: ''
    };
  }

  async componentDidMount() {
    const { date } = this.props;
    this.setState({ mmyyID: date });
    const userId = await this.getUserId();
    this.setState({ userId });
    if (userId) {
      const catTotal = await this.renderCatTotals();
      const spendingTotal = await this.renderSpendingTotal();
      this.setState({ catTotals: catTotal, spentTotal: spendingTotal });
      const dataPoints = this.creatingDataPoints();
      this.setState({ datapoints: dataPoints });
    }
  }

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillReceiveProps(rerender) {
    const { date, render } = this.props;
    this.setState({ mmyyID: date });
    if (render) {
      const catTotal = await this.renderCatTotals();
      const spendingTotal = await this.renderSpendingTotal();
      this.setState({ catTotals: catTotal, spentTotal: spendingTotal });
      const dataPoints = this.creatingDataPoints();
      this.setState({ datapoints: dataPoints });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getUserId() {
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      return fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            return json.userId;
          }
          return json.userId;
        });
    }
  }

  creatingDataPoints() {
    const dataPoints = [];
    const { spentTotal, catTotals } = this.state;
    catTotals.forEach((cat) => {
      if (cat._id !== 'Income') {
        const category = cat._id;
        const categoryTotal = cat.totals;
        const percent = 100 * (categoryTotal / spentTotal).toFixed(2);
        dataPoints.push({
          y: percent,
          label: category
        });
      }
    });
    return dataPoints;
  }

  async renderSpendingTotal() {
    const { userId, mmyyID } = this.state;
    return transactionAPI.getSpendingTotal(userId, mmyyID).then((spendTotal) => {
      if (spendTotal[0]) {
        return (spendTotal[0].spendingTotal / 100).toFixed(2);
      }
      return 0;
    });
  }

  async renderCatTotals() {
    // query for all of the logged in users transactions
    const { userId, mmyyID } = this.state;
    const vals = await transactionAPI.getTotalsAll(userId, mmyyID).then((catTotals) => {
      catTotals.forEach((resitem) => {
        const item = resitem;
        item.totals = ((item.totals / 100).toFixed(2));
      });

      return catTotals;
    });
    return vals;
  }

  render() {
    const { datapoints } = this.state;
    const options = {
      theme: 'dark',
      animationEnabled: true,
      exportEnabled: false,
      // title:{
      // text: "Category Spending Breakdown"
      // },
      data: [{
        type: 'pie',
        showInLegend: true,
        legendText: '{label}',
        toolTipContent: '{label}: <strong>{y}%</strong>',
        indexLabel: '{y}%',
        indexLabelPlacement: 'inside',
        dataPoints: datapoints
      }]
    };
    return (
      <div className="graph-wrapper">
        <h2>Category Spending Breakdown</h2>
        {/* <div className="graph"> */}
        <CanvasJSChart options={options} />
        {/* </div> */}
      </div>
    );
  }
}

export default Graph;
