import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

class AddExpenseModal extends Component {
    constructor() {
        super();
    }
    render() {
        if (this.props.selectedexpense) {
            return (
                <Modal
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
                                selected={this.props.selectedexpense.date}
                                onChange={(date) =>
                                    this.props.datechange(
                                        date,
                                        this.props.selectedexpense
                                    )
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formItem">
                            <Form.Label>Item</Form.Label>
                            <Form.Control
                                type="text"
                                name="item"
                                value={this.props.selectedexpense.item}
                                onChange={this.props.onChange}
                                className={
                                    this.props.errors.item ? 'errorBox' : ''
                                }
                            />
                            <div className="errorMsg">
                                {this.props.errors.item}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="$"
                                value={this.props.selectedexpense.price}
                                onChange={this.props.onChange}
                                className={
                                    this.props.errors.price ? 'errorBox' : ''
                                }
                            />
                            <div className="errorMsg">
                                {this.props.errors.price}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={this.props.selectedexpense.category}
                                onChange={this.props.onChange}
                                className={
                                    this.props.errors.category ? 'errorBox' : ''
                                }
                            >
                                <option value="">Choose...</option>
                                <option value="Housing">Housing</option>
                                <option value="Food">Food</option>
                                <option value="Social">Social</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Transportation">
                                    Transportation
                                </option>
                                <option value="Personal Spending">
                                    Personal Spending
                                </option>
                                <option value="Education">Education</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Misc.">Misc</option>
                            </Form.Control>
                            <div className="errorMsg">
                                {this.props.errors.category}
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={this.props.onCancel}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.props.onSubmit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return <div />;
        }
    }
}

export default AddExpenseModal;
