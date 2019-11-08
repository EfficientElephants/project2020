import React, { Component } from 'react';
import { Row, Col, Container, Button, ButtonToolbar, Modal } from 'react-bootstrap';
import NavBar from './Navbar';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <MyVerticallyCenteredModal
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
                      <App />
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