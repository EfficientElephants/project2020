import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';

//import purchaseAPI from '../../../api/purchaseAPI';
import AddExpenseModal from './AddExpenseModal';

class AddExpense extends Component {
    constructor() {
        super();
        this.state = {
            expenses: [],
            addingExpense: false,
            error: false,
            showModal: false
        };

        this.handleSave = this.handleSave.bind(this);
        //this.handleCancel = this.handleCancel.bind(this);
        //this.handleChange = this.handleChange.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
    }


    handleEnableModal () {
        this.setState({
            showModal: true,
            selectedExpense: {item: '', price:'', category: 'Rent'}
        });
        console.log("enabling");
        console.log(this.state.showModal);
    }

    handleDisableModal() {
        console.log("disabling");
        this.setState({
            showModal: false
        })
    }

    handleSave() {
        this.handleDisableModal();
    }

    render() {
        return (
            <Container>
                <Row>
                    <div>
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Purchase</Button>
                        <AddExpenseModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            handlesave = {this.handleSave}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddExpense;
