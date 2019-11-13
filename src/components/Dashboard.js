import React, { Component } from 'react';
import { Row, Col, Container, Button, ButtonToolbar, Modal, Form } from 'react-bootstrap';
import NavBar from './Navbar';
import Users from './Users';
import PurchaseModal from './PurchaseModal';
import ModalButton from './ModalButton';

import purchaseAPI from '../api/purchaseAPI';

//update to include purchase binding

class Dashboard extends Component {
  constructor () {
    super();

    this.state = { 
      purchase: [], 
      addingPurchase: false, 
      error: false, 
      openedModal: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  
  }

  openModal() {
    this.setState({openedModal: true});
  }

  closeModal() {
    this.setState({openedModal: false});
  }

  handleSave () {
    let purchases = this.state.purchases;

    if (this.state.addingPurchase) {
    purchaseAPI
        .create(this.state.selectedPurchase)
        .then(result => {
            if (result.errors) {
                console.log(result);
                this.setState({error: true});
            }
            else {
                console.log('Successfully created!');
                purchases.push(this.state.selectedPurchase);
                this.setState({
                    purchases: purchases,
                    selectedPurchase: null,
                    addingPurchase: false,
                    error: false
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
}

handleCancel() {
  this.setState({ selectedPurchase: null, addingPurchase: false})
  this.closeModal();
}

handleEnableAddMode() {
  this.openModal();
  this.setState({
    addingPurchase: true,
    selectedPurchase: {item: '', price:'', category: ''}
  });
  
}

modalClick() {
  this.handleEnableAddMode(); 
  this.openModal();
}

modalProps = {
  triggerText: 'Add a Purchase'
};

    render() {
      return (
        <div>
          <p>test</p>
          <ModalButton modalProps={this.modalProps}/>
          <p>test2</p>

        </div>
        // <div>
        //   <NavBar />
        //   <Container>
        //     <br />
        //     <h1>Your Dashboard</h1>
        //     <br />
        //     <Row>
        //     <Col>
        //       <h3>Spending Status</h3>
        //         <Row>
        //           <Col>
        //             <p>A graph of spending status will go here later.</p>
        //           </Col>
        //           <Col>
        //             <p>An explanation of spending status will go here too.</p>
        //           </Col>
        //           <Col>
        //             <Button>


        //               <ButtonToolbar>
        //                 <Button variant="primary" onClick={this.openModel}>
        //                 Add a Purchase
        //                 </Button>
        //               </ButtonToolbar>


        //             </Button>
        //           </Col>
        //         </Row>
        //     </Col>
        //   </Row>
        //   <br />
        //   <Row>
        //     <Col>
        //       <h3>Loan Tracker</h3>
        //       <p>Student Debt</p>
        //       <p>Car Payment</p>
        //     </Col>
        //     <Col>
        //       <h3>Expense Breakdown</h3>
        //        <p>Rent</p>
        //        <p>Food</p>
        //        <p>Social</p>
        //        <p>Medical</p>
        //        <p>Transportation</p>
        //        <p>Personal Care</p>
        //     </Col>
        //   </Row>
        //   </Container>
        //   <Users />
        // </div>
      );
    }
  }
  
  export default Dashboard;