import React, { Component } from 'react';
import { Row, Col, Container, Button, ButtonToolbar, Modal, Form } from 'react-bootstrap';
import ReactDOM from 'react-dom';

class PurchaseModal extends Component {
    render() {
        return ReactDOM.createPortal(
            <aside>
                <div className="modal-area">
                    <button className="_modal-close">
                    <span className="_hide-visual">Close</span>
                    <svg className="_modal-close-icon" viewBox="0 0 40 40">
                        <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                    </svg>
                    </button>
                    <div className="modal-body">The Actual Content in the Modal!</div>
                </div>
            </aside>, 
            document.body
            );
            
                // <Modal>
                    
                // </Modal>
                /* <Modal
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
                            <Button 
                            // onClick={props.onHide}
                            >
                            Cancel</Button>
                        </Modal.Footer>
                    // </Modal> *///}
            // </div>
        // );
    }
}

export default PurchaseModal;
