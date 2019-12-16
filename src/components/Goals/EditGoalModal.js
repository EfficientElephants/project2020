import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditGoalModal = props => {
    if (props.selectedgoal) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit a Goal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="goalMsg">{props.errors.goalError}</div>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <h6>{props.selectedgoal.category}</h6>
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

export default EditGoalModal;