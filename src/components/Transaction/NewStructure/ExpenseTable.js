import React, { Component } from 'react';
import ReactTable from 'react-table'
import purchaseAPI from '../../../api/purchaseAPI';
import 'react-table/react-table.css'

import styled from 'styled-components';

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class UpdateExpense extends Component {
    updateTransaction = event => {
        event.preventDefault()

        window.location.href = `/transactions/`;
    }

    render() {
        return <Update onClick={this.updateTransaction}>Update</Update>
    }
}

class DeleteExpense extends Component {
    deleteUser = event => {
        event.preventDefault()
        console.log(this.props.id)
        console.log(this.props)
        if (
            window.confirm(
                `Do you want to delete the movie ${this.props.id} permanently?`,
            )
        ) {
            purchaseAPI
                .destroy(this.props.id);
            purchaseAPI
            .get()
            .then(purchase => {
                this.setState({expenses: purchase});
            });
        }
           //window.location.reload()
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ExpenseTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await purchaseAPI
            .get()
            .then(purchase => {
            this.setState({
                expenses: purchase,
                isLoading: false,
            });
        });
        console.log(this.expenses);
    }

    render() {
        const { expenses, isLoading } = this.state
        console.log('ExpenseTable -> render -> expenses', expenses)

        const columns = [
            {
                Header: 'Category',
                accessor: 'category',
                //filterable: true,
            },
            {
                Header: 'Item',
                accessor: 'item',
                //filterable: true,
            },
            {
                Header: 'Price',
                accessor: 'price',
                //filterable: true,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteExpense id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateExpense id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!expenses.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable striped highlight
                        data={expenses}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ExpenseTable