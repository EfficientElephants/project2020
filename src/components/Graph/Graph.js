import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import transactionAPI from '../../api/transactionAPI';
import {
  getFromStorage
} from '../Storage';

import CanvasJSReact from '../../assets/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      catTotals: [],
      spentTotal: '',
      dataPoints: [],
      mmyyID: '',
    };
  }

  async componentDidMount() {
    this.setState({ mmyyID: this.props.date });
    this.setState({ rerender: false });
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

  // eslint-disable-next-line no-unused-vars
  async UNSAFE_componentWillReceiveProps(render) {
    this.setState({ mmyyID: this.props.date });
    if (this.props.render) {
      const catTotal = await this.renderCatTotals();
      const spendingTotal = await this.renderSpendingTotal();
      this.setState({ catTotals: catTotal, spentTotal: spendingTotal });
      const dataPoints = this.creatingDataPoints();
      this.setState({ datapoints: dataPoints });
    }
  }

  creatingDataPoints() {
    const dataPoints = [];
    this.state.catTotals.forEach((cat) => {
      if (cat._id !== 'Income') {
        const category = cat._id;
        const categoryTotal = cat.totals;
        const percent =
                    100 * (categoryTotal / this.state.spentTotal).toFixed(2);
        dataPoints.push({
          y: percent,
          label: category,
        });
      }
    });

    return dataPoints;
  }

  async getUserId() {
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      return await fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            return json.userId;
            // this.setState({ userId: json.userId, error: false })
          }
          // handle error
          console.log('not working');

          return json.userId;
        });
    }
  }

  async renderSpendingTotal() {
    return await transactionAPI
      .getSpendingTotal(this.state.userId, this.state.mmyyID)
      .then((spendTotal) => {
        if (spendTotal[0]) {
          return (spendTotal[0].spendingTotal / 100).toFixed(2);
        }
        return 0;
      });
  }

  async renderCatTotals() {
    // query for all of the logged in users transactions
    const vals = await transactionAPI
      .getTotalsAll(this.state.userId, this.state.mmyyID)
      .then((catTotals) => {
        catTotals.forEach((item) => {
          item.totals = (item.totals / 100).toFixed(2);
        });

        return catTotals;
      });
    return vals;
  }

  render() {
    const options = {
      theme: 'dark',
      animationEnabled: true,
      exportEnabled: false,
      // title:{
      // 	text: "Category Spending Breakdown"
      // },
      data: [
        {
          type: 'pie',
          showInLegend: true,
          legendText: '{label}',
          toolTipContent: '{label}: <strong>{y}%</strong>',
          indexLabel: '{y}%',
          indexLabelPlacement: 'inside',
          dataPoints: this.state.datapoints,
        },
      ],
    };
    return (
      <div className="graph-wrapper">
        <h3>Category Spending Breakdown</h3>
        {/* <div className="graph"> */}
        <CanvasJSChart
          options={options}
        />
        {/* </div> */}
      </div>
    );
  }
}
Graph.propTypes = {
  date: PropTypes.string.isRequired,
  render: PropTypes.bool,
};

export default Graph;
