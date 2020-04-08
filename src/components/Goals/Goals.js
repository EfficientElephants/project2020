/* eslint-disable no-unused-vars */
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
      const month = this.state.date.getMonth() + 1;
      const year = this.state.date.getFullYear() - 2000;
      const mmyyID = dateformat(this.state.date, 'mmyy');

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
        lastMonth = ((this.state.date.getMonth() + 1) < 10 ? '0' : '') + (this.state.date.getMonth());
      }
      const oldMMYYID = lastMonth + lastYear;
      const oldGoals = await this.getGoals(oldMMYYID);

      if (currentGoals.length === 0 && oldGoals.length !== 0 && this.state.date.getDate() === 2) {
        const updatedGoals = await this.createNewDatabases(oldGoals)
          .then((res) => {
            const updatedGoalsInside = this.getGoals(this.state.mmyyID);
            return updatedGoalsInside;
          });
        this.setState({ goalList: updatedGoals });
      } else {
        this.setState({ goalList: currentGoals });
      }
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(render) {
    if (this.props.render) {
      goalAPI.get({
        userId: this.state.userId,
        mmyyID: this.state.mmyyID
      }).then((json) => {
        this.setState({
          goalList: json
        });
      });
    }
  }

  getGoals(mmyyID) {
    return goalAPI.get({ userId: this.state.userId, mmyyID });
  }

  createNewDatabases(oldGoals) {
    for (const goalIdx in oldGoals) {
      const goal = {};
      goal.category = oldGoals[goalIdx].category;
      goal.goalAmount = oldGoals[goalIdx].goalAmount;
      goal.spentAmount = 0;
      goalAPI.create(goal, this.state.userId);
    }
    return this.getGoals(this.state.mmyyID);
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

  handleEnableModal(goal) {
    this.setState({
      showModal: true,
      // selectedGoal: {category: '', goalAmount: ''}
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
    goalAPI.destroy(goal).then(() => {
      let goals = this.state.goalList;
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
      const spent = await (transactionAPI.getTotalsAll(this.state.userId, this.state.mmyyID)
        .then((allTotals) => {
          allTotals.forEach((item) => {
            item.totals = ((item.totals / 100).toFixed(2));
          });
          let total = 0;
          allTotals.forEach((element) => {
            if (element._id === this.state.selectedGoal.category) {
              total = element.totals;
            }
          });
          return total;
        }));
      this.state.selectedGoal.spentAmount = spent;
      await goalAPI
        .update(this.state.selectedGoal)
        .then((result) => {
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
    const validatedGoal = this.state.selectedGoal;
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

    for (let i = 0; i < this.state.goalList.length; i += 2) {
      const subarray = [];
      subarray.push(this.state.goalList[i]);
      if (i + 1 < this.state.goalList.length) {
        subarray.push(this.state.goalList[i + 1]);
      } else {
        subarray.push([]);
      }
      array.push(subarray);
    }
    return array;
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <div>
              <EditGoalModal
                show={this.state.showModal}
                onHide={this.handleDisableModal}
                onSubmit={this.handleSave}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                selectedgoal={this.state.selectedGoal}
                errors={this.state.errors}
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
                        rerender={this.state.render}
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
