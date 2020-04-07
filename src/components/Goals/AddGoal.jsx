/* eslint-disable no-underscore-dangle */
import React, {
  Component
} from 'react';
import {
  Container, Row, Button
} from 'react-bootstrap';
import AddGoalModal from './AddGoalModal';
import goalAPI from '../../api/goalAPI';
import transactionAPI from '../../api/transactionAPI';
import {
  getFromStorage
} from '../Storage';
import usersAPI from '../../api/userAPI';

const dateformat = require('dateformat');

class AddGoal extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      errors: {},
      showModal: false,
    };

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
      usersAPI.getUserId(token)
        .then((results) => {
          console.log(results.userId);
          this.setState({userId: results.userId});
        });
      fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            console.log(json.userId);
            this.setState({ userId: json.userId }); // , error: false })
          } else {
            
          }
        });
    }
  }

  handleChange(event) {
    const { selectedGoal } = this.state;
    selectedGoal[event.target.name] = event.target.value;
    this.setState({ selectedGoal });
  }

  handleCancel() {
    this.setState({ selectedGoal: null, showModal: false });
    this.handleDisableModal();
  }

  handleEnableModal() {
    this.setState({
      showModal: true,
      selectedGoal: { category: '', goalAmount: '' },
    });
  }

  handleDisableModal() {
    this.setState({
      showModal: false,
      selectedGoal: null,
    });
  }

  async handleSave(event, props) {
    event.preventDefault();

    if (this.validateForm()) {
      const { userId, selectedGoal } = this.state;
      const spent = await transactionAPI
        .getTotalsAll(userId, dateformat(new Date(), 'mmyy'))
        .then((allTotals) => {
          allTotals.forEach((resitem) => {
            const item = resitem;
            item.totals = (item.totals / 100).toFixed(2);
          });
          let total = 0;
          allTotals.forEach((element) => {
            if (element._id === selectedGoal.category) {
              total = element.totals;
            }
          });
          return total;
        });
      selectedGoal.spentAmount = spent;
      goalAPI
        .create(selectedGoal, userId)
        .then((result) => {
          if (result.errors) {
            this.setState({
              errors: {
                goalError:
                                    'Goal already exists, please update existing goal.',
              },
            });
          } else {
            this.setState({
              selectedGoal: null,
            });
            this.handleDisableModal();
            props.stateChange(true);
          }
        });
    }
  }

  validateForm() {
    const { state } = this.state;
    const validatedGoal = state.selectedGoal;
    const errors = {};
    let formIsValid = true;

    if (!validatedGoal.goalAmount) {
      formIsValid = false;
      errors.goalAmount = 'Please enter a valid amount.';
    }

    if (validatedGoal.goalAmount !== '') {
      // regular expression for price validation
      const pattern = new RegExp(/^(\d+(\.\d{2})?|\.\d{2})$/);
      if (!pattern.test(validatedGoal.goalAmount)) {
        formIsValid = false;
        errors.goalAmount =
                    'Please enter a valid non-negative amount';
      }
    }

    if (!validatedGoal.category) {
      formIsValid = false;
      errors.category = 'Please select a category.';
    }
    this.setState({ errors });
    return formIsValid;
  }

  render() {
    const { showModal, selectedGoal, errors } = this.state;
    return (
      <Container>
        <Row>
          <div>
            <Button
              variant="secondary"
              onClick={this.handleEnableModal}
            >
              Add New Goal
            </Button>
            <AddGoalModal
              show={showModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedgoal={selectedGoal}
              errors={errors}
            />
          </div>
        </Row>
      </Container>
    );
  }
}

export default AddGoal;
