import React, {
  Component
} from 'react';
import {
  Modal, Button, Form
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';


class AddExpenseModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { selectedexpense, datechange, onCancel, onChange, onSubmit, errors } = this.props;
    if (selectedexpense) {
      return (
        <Modal
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add an Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formDate">
              <Form.Label> Date </Form.Label>
              <DatePicker
                showPopperArrow={false}
                selected={selectedexpense.date}
                onChange={(date) =>
                  datechange(date, selectedexpense)}
              />
            </Form.Group>

            <Form.Group controlId="formItem">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                name="item"
                value={selectedexpense.item}
                onChange={onChange}
                className={errors.item ? 'errorBox' : ''}
              />
              <div className="errorMsg">{errors.item}</div>
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="$"
                value={selectedexpense.price}
                onChange={onChange}
                className={errors.price ? 'errorBox' : ''}
              />
              <div className="errorMsg">{errors.price}</div>
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={selectedexpense.category}
                onChange={onChange}
                className={errors.category ? 'errorBox' : ''}
              >
                <option value="">Choose...</option>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Social">Social</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Transportation">Transportation</option>
                <option value="Personal Spending">Personal Spending</option>
                <option value="Education">Education</option>
                <option value="Utilities">Utilities</option>
                <option value="Misc.">Misc</option>
              </Form.Control>
              <div className="errorMsg">{errors.category}</div>
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

export default AddExpenseModal;
