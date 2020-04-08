/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, {
  Component
} from 'react';
import {
  Container, Row, Table
} from 'react-bootstrap';
import {
  parseISO
} from 'date-fns';
import Transaction from './TransactionRow';
import transactionAPI from '../../api/transactionAPI';
import goalAPI from '../../api/goalAPI';
import {
  getFromStorage
} from '../Storage';
import AddExpenseModal from './Expense/AddExpenseModal';
import AddIncomeModal from './Income/AddIncomeModal';

const dateformat = require('dateformat');

class TransactionTable extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      transactions: [],
      errors: {},
      showExpenseModal: false,
      showIncomeModal: false,
      rerender: false,
      spendingTotal: '',
      incomeTotal: '',
      mmyyID: ''
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
            this.setState({ userId: json.userId, error: false });
            transactionAPI.get(this.state.userId, this.props.dates).then((res) =>
              this.setState({ transactions: res }));
            transactionAPI.getSpendingTotal(this.state.userId, this.props.dates).then((resjson) => {
              if (resjson[0]) {
                this.setState({ spendingTotal: ((resjson[0].spendingTotal) / 100).toFixed(2) });
              } else {
                this.setState({ spendingTotal: 0 });
              }
            });
            transactionAPI.getIncomeTotal(this.state.userId, this.props.dates).then((json2) => {
              if (json2[0]) {
                this.setState({ incomeTotal: ((json2[0].incomeTotal) / 100).toFixed(2) });
              } else {
                this.setState({ incomeTotal: 0 });
              }
            });
          }
        });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(render) {
    if (this.props.render) {
      transactionAPI.get(this.state.userId, this.props.dates).then((json) =>
        this.setState({ transactions: json }));
      transactionAPI.getSpendingTotal(this.state.userId, this.props.dates).then((json) => {
        if (json[0]) {
          this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
        } else {
          this.setState({ spendingTotal: 0 });
        }
      });
      transactionAPI.getIncomeTotal(this.state.userId, this.props.dates).then((json) => {
        if (json[0]) {
          this.setState({ incomeTotal: ((json[0].incomeTotal) / 100).toFixed(2) });
        } else {
          this.setState({ incomeTotal: 0 });
        }
      });
    }
  }

  handleDateChange(val, propSelected) {
    this.setState({ date: val, mmyyID: dateformat(val, 'mmyy') });
    const selectedTransaction = propSelected;
    selectedTransaction.date = val;
    selectedTransaction.monthYearId = dateformat(val, 'mmyy');
    this.setState({ selectedTransaction });
  }

  handleSelect(transaction) {
    this.setState({
      selectedTransaction: transaction,
      editingTransaction: transaction
    });
    this.handleEnableModal(transaction);
  }

  // REWORK
  async handleDelete(event, transaction) {
    event.stopPropagation();
    const { price } = transaction;
    transactionAPI.destroy(transaction).then(() => {
      let { transactions } = this.state;
      transactions = transactions.filter((h) =>
        h !== transaction);
      this.setState({ transactions });

      if (this.selectedTransaction === transaction) {
        this.setState({ selectedTransaction: null });
      }
    });
    const goals = await (goalAPI
      .get({ userId: this.state.userId, mmyyID: transaction.monthYearId })
      // eslint-disable-next-line implicit-arrow-linebreak
      .then((resgoals) => resgoals)
    );
    let goal = null;
    goals.forEach((item) => {
      if (item.category === transaction.category) {
        goal = item;
      }
    });
    if (goal) {
      goal.spentAmount = parseFloat(goal.spentAmount) - parseFloat(price);
      goalAPI
        .update(goal)
        .catch((err) => {});
    }

    await transactionAPI.getSpendingTotal(this.state.userId, this.props.dates).then((json) => {
      if (json[0]) {
        this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
      } else {
        this.setState({ spendingTotal: 0 });
      }
    });
    await transactionAPI.getIncomeTotal(this.state.userId, this.props.dates).then((json) => {
      if (json[0]) {
        this.setState({ incomeTotal: ((json[0].incomeTotal) / 100).toFixed(2) });
      } else {
        this.setState({ incomeTotal: 0 });
      }
    });
  }

  async handleSave(event) {
    event.preventDefault();
    let validatedInputs = false;
    if (this.state.selectedTransaction.transactionType === 'expense') {
      if (this.validateExpenseForm()) {
        validatedInputs = true;
      }
    } else if (this.state.selectedTransaction.transactionType === 'income') {
      if (this.validateIncomeForm()) {
        validatedInputs = true;
      }
    }
    if (validatedInputs) {
      // eslint-disable-next-line
            var transRes = await(transactionAPI
        .update(this.state.selectedTransaction)
        .then((resp) =>
          transactionAPI.getTotalsAll(this.state.userId, this.state.selectedTransaction.monthYearId)
            .then((allTotals) => {
              allTotals.forEach(function (item) {
                item.totals = ((item.totals / 100).toFixed(2));
              });
              return allTotals;
            }))
        .then((totals) => {
          goalAPI
            .get({ userId: this.state.userId, mmyyID: this.state.selectedTransaction.monthYearId })
            .then((allGoals) => {
              let updatedGoal = null;
              totals.forEach(function (total) {
                allGoals.forEach(function (goal) {
                  if (goal.category === total._id) {
                    updatedGoal = goal;
                    updatedGoal.spentAmount = total.totals;
                  }
                });
              });
              if (updatedGoal) {
                goalAPI
                  .update(updatedGoal)
                  .catch((err) => {});
              }
            });
        })
        .catch((err) => {}));
      await transactionAPI.get(this.state.userId, this.props.dates).then((json) =>
        this.setState({ transactions: json }));
      await transactionAPI.getSpendingTotal(this.state.userId, this.props.dates).then((json) => {
        if (json[0]) {
          this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
        } else {
          this.setState({ spendingTotal: 0 });
        }
      });
      await transactionAPI.getIncomeTotal(this.state.userId, this.props.dates).then((json) => {
        if (json[0]) {
          this.setState({ incomeTotal: ((json[0].incomeTotal) / 100).toFixed(2) });
        } else {
          this.setState({ incomeTotal: 0 });
        }
      });

      this.props.stateChange(true);
      this.handleDisableModal();
    }
  }

  handleChange(event) {
    const { selectedTransaction } = this.state;
    selectedTransaction[event.target.name] = event.target.value;
    this.setState({
      selectedTransaction
    });
  }

  handleCancel() {
    transactionAPI.get(this.state.userId, this.props.dates).then((json) =>
      this.setState({ transactions: json }));
    this.setState({
      selectedTransaction: null,
    });
    this.handleDisableModal();
  }

  handleEnableModal(transaction) {
    transaction.date = (parseISO(transaction.date));
    if (transaction.transactionType === 'expense') {
      this.setState({
        showExpenseModal: true
      });
    } else {
      this.setState({
        showIncomeModal: true
      });
    }
  }

  handleDisableModal() {
    this.setState({
      showExpenseModal: false,
      showIncomeModal: false,
      selectedTransaction: null,
    });
  }

  validateExpenseForm() {
    const validatedExpense = this.state.selectedTransaction;
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

    if (validatedExpense.price !== 'undefined') {
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

  validateIncomeForm() {
    const validatedIncome = this.state.selectedTransaction;
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
    return (
      <Container>
        <Row>
          <div>
            <AddExpenseModal
              show={this.state.showExpenseModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedexpense={this.state.selectedTransaction}
              errors={this.state.errors}
              datechange={this.handleDateChange}
            />
            <AddIncomeModal
              show={this.state.showIncomeModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedincome={this.state.selectedTransaction}
              errors={this.state.errors}
              datechange={this.handleDateChange}
            />
          </div>
        </Row>
        <Row>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Item</th>
                <th>Price</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {this.state.transactions.map((transaction) =>
                (
                  <Transaction
                    transaction={transaction}
                    key={transaction._id}
                    onSelect={this.handleSelect}
                    selectedTransaction={this.state.selectedTransaction}
                    onDelete={this.handleDelete}
                  />
                ))}
              <tr>
                <th>Total Amount Spent</th>
                <th>
                  $
                  {this.state.spendingTotal}
                </th>
                <th>Total Income</th>
                <th>
                  $
                  {this.state.incomeTotal}
                </th>
              </tr>
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}
export default TransactionTable;
