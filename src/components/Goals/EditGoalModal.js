/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Modal, Button, Form
} from 'react-bootstrap';

const EditGoalModal = (props) => {
  const { selectedgoal, onChange, errors, onHide, onSubmit } = props;
  if (selectedgoal) {
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
          <div className="goalMsg">{errors.goalError}</div>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <h6>{selectedgoal.category}</h6>
            <div className="errorMsg">{errors.category}</div>
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="goalAmount"
              placeholder="$"
              value={selectedgoal.goalAmount}
              onChange={onChange}
              className={errors.goalAmount ? 'errorBox' : ''}
            />
            <div className="errorMsg">{errors.goalAmount}</div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return <div />;
};

export default EditGoalModal;
