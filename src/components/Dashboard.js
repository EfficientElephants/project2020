import React, { Component } from 'react';
import { Row, Col, Container, Button, ButtonToolbar, Modal, Form } from 'react-bootstrap';
import NavBar from './Navbar';

function DashboardModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add a Purchase
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form.Group controlId="formItem">
            <Form.Label>Item</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control type="text" placeholder="$" />
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select">
              <option>Rent</option>
              <option>Food</option>
              <option>Social</option>
              <option>Medical</option>
              <option>Transportation</option>
              <option>Personal Care</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

function AddPurchaseModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button variant="primary" onClick={() => setModalShow(true)}>
      Add a Purchase
      </Button>

      <DashboardModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </ButtonToolbar>
  );
}


class Dashboard extends Component {

    render() {
      return (
        <div>
          <NavBar />
          <Container>
            <br />
            <h1>Your Dashboard</h1>
            <br />
            <Row>
            <Col>
              <h3>Spending Status</h3>
                <Row>
                  <Col>
                    <p>A graph of spending status will go here later.</p>
                  </Col>
                  <Col>
                    <p>An explanation of spending status will go here too.</p>
                  </Col>
                  <Col>
                    <Button>
                      <AddPurchaseModal />
                    </Button>
                  </Col>
                </Row>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h3>Loan Tracker</h3>
              <p>Student Debt</p>
              <p>Car Payment</p>
            </Col>
            <Col>
              <h3>Expense Breakdown</h3>
               <p>Rent</p>
               <p>Food</p>
               <p>Social</p>
               <p>Medical</p>
               <p>Transportation</p>
               <p>Personal Care</p>
            </Col>
          </Row>
          </Container>
        </div>
      );
    }
  }
  
  export default Dashboard;