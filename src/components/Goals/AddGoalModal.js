import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddGoalModal = props => {
    if (props.selectedgoal) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add a Goal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="goalMsg">{props.errors.goalError}</div>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                            as="select"
                            name="category"
                            value = {props.selectedgoal.category}
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
                    <Form.Group controlId="formPrice">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="goalAmount"
                            placeholder="$"
                            value={props.selectedgoal.goalAmount} 
                            onChange={props.onChange}
                            className={props.errors.goalAmount ? "errorBox" : "" }
                        />
                        <div className="errorMsg">{props.errors.goalAmount}</div>
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

export default AddGoalModal;