import React, {
  Component
} from 'react';
import {
  Modal, Button, Form
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

class AddIncomeModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { datechange, selectedincome, errors, onSubmit, onCancel, onChange } = this.props;
    if (selectedincome) {
      return (
        <Modal
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Income</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formDate">
              <Form.Label> Date </Form.Label>
              <DatePicker
                showPopperArrow={false}
                selected={selectedincome.date}
                onChange={(date) =>
                  datechange(date, selectedincome)}
              />
            </Form.Group>

            <Form.Group controlId="formItem">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                name="item"
                value={selectedincome.item}
                onChange={onChange}
                className={errors.item ? 'errorBox' : ''}
              />
              <div className="errorMsg">{errors.item}</div>
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="$"
                value={selectedincome.price}
                onChange={onChange}
                className={errors.price ? 'errorBox' : ''}
              />
              <div className="errorMsg">{errors.price}</div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    return <div />;
  }
}

export default AddIncomeModal;
