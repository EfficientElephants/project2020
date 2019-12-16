import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddExpenseModal = props => {
    if (props.selectedexpense) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add an Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formItem">
                        <Form.Label>Item</Form.Label>
                        <Form.Control 
                            type="text"
                            name="item"
                            value={props.selectedexpense.item}
                            onChange = {props.onChange} 
                            className={props.errors.item ? "errorBox" : "" }
                        />
                        <div className="errorMsg">{props.errors.item}</div>
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="price"
                            placeholder="$"
                            value={props.selectedexpense.price} 
                            onChange={props.onChange}
                            className={props.errors.price ? "errorBox" : "" }
                        />
                        <div className="errorMsg">{props.errors.price}</div>
                    </Form.Group>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                            as="select"
                            name="category"
                            value = {props.selectedexpense.category}
                            onChange={props.onChange}
                            className={props.errors.category ? "errorBox" : "" }
                        >
                            <option value="">Choose...</option>
                            <option value="Rent">Rent</option>
                            <option value="Food">Food</option>
                            <option value="Social">Social</option>
                            <option value="Medical">Medical</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Personal Care">Personal Care</option>
                        </Form.Control>
                        <div className="errorMsg">{props.errors.category}</div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={props.onSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    } else {
        return <div/>;
    }
};

export default AddExpenseModal;