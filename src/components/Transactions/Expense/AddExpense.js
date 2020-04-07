import React, {
  Component
} from 'react';
import {
  Container, Row, Button
} from 'react-bootstrap';
import AddExpenseModal from './AddExpenseModal';
import transactionAPI from '../../../api/transactionAPI';
import {
  getFromStorage
} from '../../Storage';
import goalAPI from '../../../api/goalAPI';

const dateformat = require('dateformat');

class AddExpense extends Component {
  constructor() {
    super();
    const CommonDate = new Date();
    this.state = {
      userId: '',
      errors: {},
      showModal: false,
      date: CommonDate,
      mmyyID: dateformat(CommonDate, 'mmyy')
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
    this.setState({ date: val, mmyyID: dateformat(val, 'mmyy') });
    const selectedExpense = propSelected;
    selectedExpense.date = val;
    selectedExpense.monthYearId = dateformat(val, 'mmyy');
    this.setState({ selectedExpense });
  }

  handleChange(event) {
    const { selectedExpense } = this.state;
    selectedExpense[event.target.name] = event.target.value;
    this.setState({ selectedExpense });
  }

  handleCancel() {
    this.setState({ selectedExpense: null, showModal: false });
    this.handleDisableModal();
  }

  handleEnableModal() {
    const { date, mmyyID } = this.state;
    this.setState({
      showModal: true,
      selectedExpense: { date, monthYearId: mmyyID, item: '', price: '', category: '', transactionType: 'expense' }
    });
  }

  handleDisableModal() {
    this.setState({
      showModal: false,
      selectedExpense: null,
      date: new Date()
    });
  }

  // REWORK
  async handleSave(event) {
    event.preventDefault();
    if (this.validateForm()) {
      const { userId, mmyyID, selectedExpense } = this.state;
      const allGoals = await (goalAPI
        .get({ userId, mmyyID })
        .then((goals) =>
          goals));
      let goal = null;
      const selectedExpenseCat = selectedExpense.category;
      const selectedExpensePrice = selectedExpense.price;
      allGoals.forEach((element) => {
        if (element.category === selectedExpenseCat) {
          goal = element;
        }
      });
      if (goal) {
        goal.spentAmount = parseFloat(goal.spentAmount) + parseFloat(selectedExpensePrice);
        goalAPI
          .update(goal);
      }
      transactionAPI
        .create(selectedExpense, userId)
        .then((result) => {
          if (!result.errors) {
            const { typeChange, stateChange } = this.props;
            this.setState({
              selectedExpense: null,
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
    typeChange('expense');
    stateChange(true);
  }

  validateForm() {
    const { selectedExpense } = this.state;
    const validatedExpense = selectedExpense;
    const errors = {};
    let formIsValid = true;

    if (!validatedExpense.item) {
      formIsValid = false;
      errors.item = 'Please enter an item.';
    }

    if (!validatedExpense.price) {
      formIsValid = false;
      errors.price = 'Please enter a valid price.';
    }

    if (validatedExpense.price !== '') {
      // regular expression for price validation
      const pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
      if (!pattern.test(validatedExpense.price)) {
        formIsValid = false;
        errors.price = 'Please enter a valid non-negative price';
      }
    }

    if (!validatedExpense.category) {
      formIsValid = false;
      errors.category = 'Please select a category.';
    }
    this.setState({ errors });
    return formIsValid;
  }


  render() {
    const { showModal, selectedExpense, errors } = this.state;
    return (
      <Container>
        <Row>
          <div>
            <Button variant="secondary" onClick={this.handleEnableModal}>Add New Expense</Button>
            <AddExpenseModal
              show={showModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedexpense={selectedExpense}
              errors={errors}
              datechange={this.handleDateChange}
            />
          </div>
        </Row>
      </Container>
    );
  }
}
export default AddExpense;
