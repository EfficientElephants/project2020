/* eslint-disable func-names */
import React, {
  Component
} from 'react';
import Chart from 'react-apexcharts';

class SummaryGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [this.props.percentage],
      options: {
        chart: {
          height: 250,
          type: 'radialBar',
        },
        colors: [function ({ value }) {
          if (value < 50) {
            return '#FF4560';
          } if (value < 80) {
            return '#FEB019';
          }
          return '#00E396';
        }],
        plotOptions: {
          radialBar: {
            hollow: {
              size: '50%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: true,
                color: '#333',
                fontSize: '30px',
                offsetY: 10,
              }
            }
          }
        },
      },
    };
  }


  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="radialBar"
        width="250"
      />
    );
  }
}

export default SummaryGraph;
