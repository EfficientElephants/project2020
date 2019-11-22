import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddExpenseModal = props => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add a Purchase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
             <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.handlesave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>


    )
}

export default AddExpenseModal;