import React, { Component } from 'react';
import { Container, Row, Button } from 'react-bootstrap';

//import purchaseAPI from '../../../api/purchaseAPI';
import AddExpenseModal from './AddExpenseModal';
import purchaseAPI from '../../../api/purchaseAPI';

class AddExpense extends Component {
    constructor() {
        super();
        this.state = {
            expenses: [],
            errors: false,
            showModal: false
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnableModal = this.handleEnableModal.bind(this);
        this.handleDisableModal = this.handleDisableModal.bind(this);
    }

    handleChange(event) {
        let selectedExpense = this.state.selectedExpense;
        selectedExpense[event.target.name] = event.target.value;
        this.setState({ selectedExpense: selectedExpense });

    }

    handleCancel() {
        this.setState({ selectedExpense: null, showModal: false });
        this.handleDisableModal();

    }

    handleEnableModal () {
        this.setState({
            showModal: true,
            selectedExpense: {item: '', price:'', category: 'Social'}
        });
        console.log("enabling");
        console.log(this.state.showModal);
        
    }

    handleDisableModal() {
        console.log("disabling");
        this.setState({
            showModal: false,
            selectedExpense: null
        })
    }

    handleSave() {
        purchaseAPI
            .create(this.state.selectedExpense)
            .then(result => {
                if (result.errors) {
                    console.log(result);
                    this.setState({error: true});

                }
                else {
                    console.log('Successfully created!');
                    this.setState({
                        selectedExpense: null,
                        errors: false
                    });
                    this.handleDisableModal();
                }
            })
        
    }

    render() {
        console.log(this.state.selectedExpense);
        return (
            <Container>
                <Row>
                    <div>
                        <Button variant="secondary" onClick={this.handleEnableModal}>Add New Purchase</Button>
                        <AddExpenseModal 
                            show={this.state.showModal}
                            onHide={this.handleDisableModal}
                            onSubmit = {this.handleSave}
                            onCancel = {this.handleCancel}
                            onChange = {this.handleChange}
                            selectedexpense = {this.state.selectedExpense}
                        />
                    </div>
                </Row>
            </Container>
        )
    }
}
export default AddExpense;
