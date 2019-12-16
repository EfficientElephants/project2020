import React, { Component } from 'react';
import transactionAPI from '../../api/transactionAPI';
import { getFromStorage } from './../Storage';

import CanvasJSReact from './../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
    constructor(){
        super();
        this.state = {
            userId: '',
            catTotals: [],
            spentTotal: '',
            dataPoints: []
        }
    }

    async componentDidMount() {
        this.setState({rerender: false});
        var userId = await this.getUserId();
        this.setState({userId: userId})
        if (userId) {
            var catTotal = await this.renderCatTotals();
            var spendingTotal = await this.renderSpendingTotal();
            this.setState({catTotals: catTotal, spentTotal: spendingTotal,})
            var dataPoints = this.creatingDataPoints();
            this.setState({datapoints: dataPoints})
        }
        
    }

    async componentWillReceiveProps(render) {
        if (this.props.render) {
            var catTotal = await this.renderCatTotals();
            var spendingTotal = await this.renderSpendingTotal();
            this.setState({catTotals: catTotal, spentTotal: spendingTotal,})
            var dataPoints = this.creatingDataPoints();
            this.setState({datapoints: dataPoints})
        }
    }

    creatingDataPoints() {
        var dataPoints = [];
        this.state.catTotals.forEach(cat => {
            if (cat._id !== "Income"){
                var category = cat._id;
                var categoryTotal = cat.totals;
                var percent = 100 * (categoryTotal/this.state.spentTotal).toFixed(2);
                dataPoints.push({
                    y: percent,
                    label: category
                })
            }
            
        }) 

        return dataPoints
    }

    async getUserId() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            return await fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    return json.userId;
                    // this.setState({ userId: json.userId, error: false })
                }else {
                    // handle error
                    console.log('not working');
                }
                return json.userId
            })
        }
    }

    async renderSpendingTotal() {
        return await transactionAPI.getSpendingTotal(this.state.userId).then(spendTotal => {
            if(spendTotal[0]){
                return (spendTotal[0].spendingTotal/100).toFixed(2)
            }else {
                return 0
            }
        })
    }

    async renderCatTotals() {
        // query for all of the logged in users transactions
        return await transactionAPI.getTotalsAll(this.state.userId).then(catTotals => {
            catTotals.forEach(function(item){
                item.totals = ((item.totals/100).toFixed(2));
                })
            return catTotals
        })
    }

    render() {
        const options = {
			theme: "dark",
			animationEnabled: true,
			exportEnabled: false,
			title:{
				text: "Category Spending Breakdown"
			},
			data: [{
				type: "pie",
				showInLegend: true,
				legendText: "{label}",
				toolTipContent: "{label}: <strong>{y}%</strong>",
				indexLabel: "{y}%",
				indexLabelPlacement: "inside",
                dataPoints: this.state.datapoints
			}]
		}
        return (
            <div className="graph-wrapper">
                {/* <div className="graph"> */}
                    <CanvasJSChart options = {options}
                        /* onRef = {ref => this.chart = ref} */
                    />
                {/* </div> */}
            </div>
        )
    }
}

export default Graph;