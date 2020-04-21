/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Modal, Button, Form
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

class AddIncomeModal extends Component {
  constructor(props) {
    super();
  }

  render() {
    if (this.props.selectedincome) {
      return (
        <Modal
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
                selected={this.props.selectedincome.date}
                onChange={(date) =>
                  this.props.datechange(date, this.props.selectedincome)}
              />
            </Form.Group>

            <Form.Group controlId="formItem">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                name="item"
                value={this.props.selectedincome.item}
                onChange={this.props.onChange}
                className={this.props.errors.item ? 'errorBox' : ''}
              />
              <div className="errorMsg">{this.props.errors.item}</div>
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="$"
                value={this.props.selectedincome.price}
                onChange={this.props.onChange}
                className={this.props.errors.price ? 'errorBox' : ''}
              />
              <div className="errorMsg">{this.props.errors.price}</div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onCancel}>
              Cancel
            </Button>
            <Button className="modal-save-changes" onClick={this.props.onSubmit}>
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
