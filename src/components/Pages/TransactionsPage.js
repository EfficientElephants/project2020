import React, { Component, useState, useEffect } from 'react';
//import axios from axios;
import { Container, Row, Col } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination'
import AddExpense from '../Transactions/Expense/AddExpense';
import AddIncome from '../Transactions/Income/AddIncome';
import TransactionTable from '../Transactions/TransactionTable';
import NavBar from '../Navbar';

//add code to pull things from db--model after User.js?

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      render: false,
    }
    this.rerender = this.rerender.bind(this);

    // const [posts, setPosts] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [postsPerPage, setPostsPerPage] = useState(5);

  }

  // useEffect( () => {
  //   const fetchPosts = async() => {
  //     setLoading(true);
  //     const res = await axios.get('')
  //   }
  // });

  rerender(val) {
    this.setState( {render: val} )
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <br />
          <h1>Your Transactions</h1>
          <br />
          <Row>
            <Col>
              <AddExpense stateChange = {this.rerender} />
            </Col>
            <Col>
              <AddIncome stateChange = {this.rerender} />
            </Col>
          </Row>
          <br />
          <div>
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />

              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>

              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </div>

          <Row>
            <TransactionTable render={this.state.render} />
          </Row>
        </Container>
      </div>
    );
  }
}
  
  export default Transactions;