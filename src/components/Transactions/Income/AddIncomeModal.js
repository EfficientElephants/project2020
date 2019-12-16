import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddIncomeModal = props => {
    if (props.selectedincome) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Income</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formItem">
                        <Form.Label>Source</Form.Label>
                        <Form.Control 
                            type="text"
                            name="item"
                            value={props.selectedincome.item}
                            onChange = {props.onChange} 
                            className={props.errors.item ? "errorBox" : "" }
                        />
                        <div className="errorMsg">{props.errors.item}</div>
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="price"
                            placeholder="$"
                            value={props.selectedincome.price} 
                            onChange={props.onChange}
                            className={props.errors.price ? "errorBox" : "" }
                        />
                        <div className="errorMsg">{props.errors.price}</div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onCancel}>
                        Cancel
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

export default AddIncomeModal;