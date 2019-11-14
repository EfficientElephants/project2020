import React, { Component } from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import purchaseAPI from '../api/purchaseAPI';

class PurchaseModal extends Component {
    constructor(props) {
        super(props);
        this.state = { modalIsOpen: false, purchases:[]};
    }

    openModal = () => {
        this.setState({ modalIsOpen: true});
    }
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleSave () {
        purchaseAPI
            .create(
                {item: this.item.value, 
                price: this.price.value, 
                category: this.category.value}
            )
            .then (result => {
                console.log('Successfully created!');
            });
        this.closeModal();
    }


    componentDidMount() {
        this.setState({ modalIsOpen:true });
    }

    render() {
        return (
            <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Add a Purchase
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
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
                <Button variant="primary" onClick={this.handleSave.bind(this)}>Submit</Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.closeModal}>Cancel</Button>
            </Modal.Footer>
            </Modal>
        );
    }
}
export default PurchaseModal;