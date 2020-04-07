/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import React, {
  Component
} from 'react';
import {
  Row, Col, Container
} from 'react-bootstrap';
import goalAPI from '../../api/goalAPI';
import {
  getFromStorage
} from '../Storage';
import transactionAPI from '../../api/transactionAPI';
import EditGoalModal from './EditGoalModal';
import GoalInfo from './GoalInfo';

const dateformat = require('dateformat');

class Goals extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      goalList: [],
      errors: {},
      showModal: false,
      render: false,
      // remaining: '',
      date: new Date(),
      mmyyID: '',
    };
    this.createArray = this.createArray.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnableModal = this.handleEnableModal.bind(this);
    this.handleDisableModal = this.handleDisableModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const { date } = this.state;
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const {
        token
      } = obj;
      const userId = await fetch(`api/getUserId?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            return json.userId;
          }
        });
      this.setState({ userId });
      const month = date.getMonth() + 1;
      const year = date.getFullYear() - 2000;
      const mmyyID = dateformat(date, 'mmyy');

      const currentGoals = await this.getGoals(mmyyID);

      this.setState({
        mmyyID,
      });

      let lastMonth = month;
      let lastYear = year;
      if (month === 1) {
        lastMonth = '12';
        lastYear -= 1;
      } else {
        lastMonth = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth());
      }
      const oldMMYYID = lastMonth + lastYear;
      const oldGoals = await this.getGoals(oldMMYYID);

      if (currentGoals.length === 0 && oldGoals.length !== 0 && date.getDate() === 2) {
        let updatedGoals = await this.createNewDatabases(oldGoals)
          .then(() => {
            updatedGoals = this.getGoals(mmyyID);
            return updatedGoals;
          });
        this.setState({ goalList: updatedGoals });
      } else {
        this.setState({ goalList: currentGoals });
      }
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(rernder) {
    const { userId, mmyyID } = this.state;
    const { render } = this.props;
    if (render) {
      goalAPI.get({
        userId,
        mmyyID
      }).then((json) => {
        this.setState({
          goalList: json
        });
      });
    }
  }

  getGoals(mmyyID) {
    const { userId } = this.state;
    return goalAPI.get({ userId, mmyyID });
  }

  createNewDatabases(oldGoals) {
    const { userId, mmyyID } = this.state;
    oldGoals.forEach((oldG) => {
      const goal = {};
      goal.category = oldG.category;
      goal.goalAmount = oldG.goalAmount;
      goal.spentAmount = 0;
      goalAPI.create(goal, userId);
    });
    return this.getGoals(mmyyID);
  }

  handleSelect(goal) {
    this.setState({
      selectedGoal: goal,
      render: false
    });
    this.handleEnableModal(goal);
  }

  handleChange(event) {
    const { selectedGoal } = this.state;
    selectedGoal[event.target.name] = event.target.value;
    this.setState({
      selectedGoal
    });
  }

  handleCancel() {
    this.setState({
      selectedGoal: null,
      showModal: false
    });
    this.handleDisableModal();
  }

  handleEnableModal() {
    this.setState({
      showModal: true,
    });
  }

  handleDisableModal() {
    this.setState({
      showModal: false,
      selectedGoal: null
    });
  }

  handleDelete(event, goal) {
    event.stopPropagation();
    const { goalList } = this.state;
    goalAPI.destroy(goal).then(() => {
      let goals = goalList;
      goals = goals.filter((h) =>
        h !== goal);
      this.setState({
        goalList: goals
      });
      if (this.selectedgoal === goal) {
        this.setState({
          selectedGoal: null
        });
      }
    });
  }

  async handleSave(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const { userId, mmyyID, selectedGoal } = this.state;
      const spent = await (transactionAPI.getTotalsAll(userId, mmyyID)
        .then((allTotals) => {
          allTotals.forEach((resitem) => {
            const item = resitem;
            item.totals = ((item.totals / 100).toFixed(2));
          });
          let total = 0;
          allTotals.forEach((element) => {
            if (element._id === selectedGoal.category) {
              total = element.totals;
            }
          });
          return total;
        }));
      selectedGoal.spentAmount = spent;
      await goalAPI
        .update(selectedGoal)
        .then(() => {
          this.setState({
            selectedGoal: null,
            render: true,
          });
          this.componentDidMount();
        });
      this.handleDisableModal();
    }
  }

  validateForm() {
    const { selectedGoal } = this.state;
    const validatedGoal = selectedGoal;
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
        errors.goalAmount = 'Please enter a valid non-negative amount';
      }
    }

    if (!validatedGoal.category) {
      formIsValid = false;
      errors.category = 'Please select a category.';
    }
    this.setState({
      errors
    });
    return formIsValid;
  }

  createArray() {
    const array = [];
    const { goalList } = this.state;
    for (let i = 0; i < goalList.length; i += 2) {
      const subarray = [];
      subarray.push(goalList[i]);
      if (i + 1 < goalList.length) {
        subarray.push(goalList[i + 1]);
      } else {
        subarray.push([]);
      }
      array.push(subarray);
    }
    return array;
  }

  render() {
    const { errors, render, showModal, selectedGoal } = this.state;
    return (
      <div>
        <Container>
          <Row>
            <div>
              <EditGoalModal
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
          {this.createArray().map((array) =>
            (
              <>
                <Row>
                  {array.map((goal, i) => {
                    if (goal.length === 0 && i % 2 === 1) {
                      return (
                        <Col
                          key={goal.length}
                        />
                      );
                    }
                    return (
                      <GoalInfo
                        goal={goal}
                        key={goal._id}
                        onSelect={this.handleSelect}
                        rerender={render}
                        onDelete={this.handleDelete}
                      />
                    );
                  })}
                </Row>
                <br />
              </>
            ))}
        </Container>
      </div>
    );
  }
}
export default Goals;
