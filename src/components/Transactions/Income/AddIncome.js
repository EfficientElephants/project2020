import React, {
  Component
} from 'react';
import {
  Container, Row, Button
} from 'react-bootstrap';

import AddIncomeModal from './AddIncomeModal';
import transactionAPI from '../../../api/transactionAPI';
import {
  getFromStorage
} from '../../Storage';

const dateformat = require('dateformat');

class AddIncome extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      errors: {},
      date: new Date(),
      showModal: false
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnableModal = this.handleEnableModal.bind(this);
    this.handleDisableModal = this.handleDisableModal.bind(this);
  }

  componentDidMount() {
    // query for all of the logged in users transactions
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({ userId: json.userId }); // , error: false })
            // transactionAPI.get(this.state.userId).then(json => this.setState({expenses:json}));
          }
        });
    }
  }

  handleDateChange(val, propSelected) {
    this.setState({ date: val });
    const selectedIncome = propSelected;
    selectedIncome.date = val;
    selectedIncome.monthYearId = dateformat(val, 'mmyy');
    this.setState({ selectedIncome });
  }

  handleChange(event) {
    const { selectedIncome } = this.state;
    selectedIncome[event.target.name] = event.target.value;
    this.setState({ selectedIncome });
  }

  handleCancel() {
    this.setState({ selectedIncome: null, showModal: false });
    this.handleDisableModal();
  }

  handleEnableModal() {
    const { date } = this.state;
    this.setState({
      showModal: true,
      selectedIncome: { date, monthYearId: dateformat(date, 'mmyy'), item: '', price: '', category: 'Income', transactionType: 'income' }
    });
  }

  handleDisableModal() {
    this.setState({
      showModal: false,
      selectedIncome: null,
      date: new Date()
    });
  }

  handleSave(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const { selectedIncome, userId } = this.state;
      const { typeChange, stateChange } = this.props;
      transactionAPI
        .create(selectedIncome, userId)
        .then((result) => {
          if (!result.errors) {
            this.setState({
              selectedIncome: null
            });
            this.handleDisableModal();
            if (typeChange) {
              this.handleAlert();
            } else {
              stateChange(true);
            }
          }
        });
    }
  }

  handleAlert() {
    const { typeChange, stateChange } = this.props;
    typeChange('income');
    stateChange(true);
  }

  validateForm() {
    const { selectedIncome } = this.state;
    const validatedIncome = selectedIncome;
    const errors = {};
    let formIsValid = true;

    if (!validatedIncome.item) {
      formIsValid = false;
      errors.item = 'Please enter an income source.';
    }

    if (!validatedIncome.price) {
      formIsValid = false;
      errors.price = 'Please enter a valid amount.';
    }

    if (validatedIncome.price !== '') {
      // regular expression for price validation
      const pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
      if (!pattern.test(validatedIncome.price)) {
        formIsValid = false;
        errors.price = 'Please enter a valid non-negative amount';
      }
    }

    this.setState({ errors });
    return formIsValid;
  }

  render() {
    const { showModal, selectedIncome, errors } = this.state;
    return (
      <Container>
        <Row>
          <div>
            <Button variant="secondary" onClick={this.handleEnableModal} id="addIncome">Add New Income</Button>
            <AddIncomeModal
              show={showModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedincome={selectedIncome}
              errors={errors}
              datechange={this.handleDateChange}
            />
          </div>
        </Row>
      </Container>
    );
  }
}
export default AddIncome;
