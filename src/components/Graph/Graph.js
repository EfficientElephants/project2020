import React, { Component } from 'react';
// import Line from './Line';
// import BarTextContent from './BarTextContent'
// import Bar from './Bar';
import transactionAPI from '../../api/transactionAPI';
import { getFromStorage } from './../Storage';

import CanvasJSReact from './../../assets/canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
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
    

    // renderLines() {
    //     return Array(10).fill(null).map((el, i) => (
    //         <Line left={i * 10} key={i}/>
    //     ))
    // }

    async componentDidMount() {
        var userId = await this.getUserId();
        this.setState({userId: userId})
        if (userId) {
            var catTotal = await this.renderCatTotals();
            var spendingTotal = await this.renderSpendingTotal();
            this.setState({catTotals: catTotal, spentTotal: spendingTotal})
        }
        
    }

    async componentDidUpdate() {

        if(this.props.spendingTotal !== this.state.spentTotal){
            var catTotal = await this.renderCatTotals();
            var spendingTotal = await this.renderSpendingTotal();
            this.setState({catTotals: catTotal, spentTotal: spendingTotal})
        }
    }

    creatingDataPoints() {
        var dataPoints = [];
        this.state.catTotals.forEach(cat => {
            var category = cat._id;
            var categoryTotal = cat.totals;
            var percent = 100 * (categoryTotal/this.state.spentTotal).toFixed(2);
            dataPoints.push({
                y: percent,
                label: category
            })
        }) 

        return (dataPoints)
    }

    async getUserId() {
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            return await fetch('api/getUserId?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success){
                    console.log("GETUSERID", json.userId)
                    return json.userId;
                    // this.setState({ userId: json.userId, error: false })
                }else {
                    // handle error
                    console.log('not working');
                }
                console.log(json.userId);
                return json.userId
            })
        }
    }

    async renderSpendingTotal() {
        return await transactionAPI.getSpendingTotal(this.state.userId).then(spendTotal => {
            return (spendTotal[0].spendingTotal/100).toFixed(2)
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
				text: "Spending Status"
			},
			data: [{
				type: "pie",
				showInLegend: true,
				legendText: "{label}",
				toolTipContent: "{label}: <strong>{y}%</strong>",
				indexLabel: "{y}%",
				indexLabelPlacement: "inside",
                dataPoints: this.creatingDataPoints()
                //[
				// 	{ y: 32, label: "Rent" },
				// 	{ y: 22, label: "Food" },
				// 	{ y: 15, label: "Social" },
				// 	{ y: 19, label: "Medical" },
				// 	{ y: 5, label: "Personal Care" },
				// 	{ y: 7, label: "Transportation" }
				// ]
			}]
		}
        return (
            <div className="graph-wrapper">
                <div className="graph">
                <div>
                    <CanvasJSChart options = {options}
                        /* onRef = {ref => this.chart = ref} */
                    />
                </div>
                    {/* <BarTextContent />
                    <div className="bar-lines-container">
                        {this.renderLines()}
                        <Bar percent={50} />
                        <Bar percent={25} />
                        <Bar percent={25} />
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Graph;