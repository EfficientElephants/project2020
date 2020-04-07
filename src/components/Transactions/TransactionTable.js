/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
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
      spendingTotal: '',
      incomeTotal: '',
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
            const { userId } = this.state;
            const { dates } = this.props;
            this.setState({ userId: json.userId });
            transactionAPI.get(userId, dates).then((resjson) =>
              this.setState({ transactions: resjson }));
            transactionAPI.getSpendingTotal(userId, dates).then((resjson2) => {
              if (resjson2[0]) {
                this.setState({ spendingTotal: ((resjson2[0].spendingTotal) / 100).toFixed(2) });
              } else {
                this.setState({ spendingTotal: 0 });
              }
            });
            transactionAPI.getIncomeTotal(userId, dates).then((resjson3) => {
              if (resjson3[0]) {
                this.setState({ incomeTotal: ((resjson3[0].incomeTotal) / 100).toFixed(2) });
              } else {
                this.setState({ incomeTotal: 0 });
              }
            });
          }
        });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(rerender) {
    const { render, dates } = this.props;
    const { userId } = this.state;
    if (render) {
      transactionAPI.get(userId, dates).then((json) =>
        this.setState({ transactions: json }));
      transactionAPI.getSpendingTotal(userId, dates).then((json) => {
        if (json[0]) {
          this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
        } else {
          this.setState({ spendingTotal: 0 });
        }
      });
      transactionAPI.getIncomeTotal(userId, dates).then((json) => {
        if (json[0]) {
          this.setState({ incomeTotal: ((json[0].incomeTotal) / 100).toFixed(2) });
        } else {
          this.setState({ incomeTotal: 0 });
        }
      });
    }
  }

  handleDateChange(val, propSelected) {
    // this.setState({ date: val, mmyyID: dateformat(val, 'mmyy') });
    const selectedTransaction = propSelected;
    selectedTransaction.date = val;
    selectedTransaction.monthYearId = dateformat(val, 'mmyy');
    this.setState({ selectedTransaction });
  }

  handleSelect(transaction) {
    this.setState({
      selectedTransaction: transaction
    });
    this.handleEnableModal(transaction);
  }

  // REWORK
  async handleDelete(event, transaction) {
    event.stopPropagation();
    const { price } = transaction;
    const { dates } = this.props;
    const { userId } = this.state;
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
      .get({ userId, mmyyID: transaction.monthYearId })
      .then((resgoals) =>
        resgoals)
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
        .update(goal);
    }

    await transactionAPI.getSpendingTotal(userId, dates).then((json) => {
      if (json[0]) {
        this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
      } else {
        this.setState({ spendingTotal: 0 });
      }
    });
    await transactionAPI.getIncomeTotal(userId, dates).then((json) => {
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
    const { selectedTransaction, userId } = this.state;
    const { dates, stateChange } = this.props;
    if (selectedTransaction.transactionType === 'expense') {
      if (this.validateExpenseForm()) {
        validatedInputs = true;
      }
    } else if (selectedTransaction.transactionType === 'income') {
      if (this.validateIncomeForm()) {
        validatedInputs = true;
      }
    }
    if (validatedInputs) {
      // eslint-disable-next-line
            var transRes = await(transactionAPI
        .update(selectedTransaction)
        .then((resp) =>
          transactionAPI.getTotalsAll(userId, selectedTransaction.monthYearId)
            .then((allTotals) => {
              allTotals.forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                item.totals = ((item.totals / 100).toFixed(2));
              });
              return allTotals;
            }))
        .then((totals) => {
          goalAPI
            .get({ userId, mmyyID: selectedTransaction.monthYearId })
            .then((allGoals) => {
              let updatedGoal = null;
              totals.forEach((total) => {
                allGoals.forEach((goal) => {
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
      await transactionAPI.get(userId, dates).then((json) =>
        this.setState({ transactions: json }));
      await transactionAPI.getSpendingTotal(userId, dates).then((json) => {
        if (json[0]) {
          this.setState({ spendingTotal: ((json[0].spendingTotal) / 100).toFixed(2) });
        } else {
          this.setState({ spendingTotal: 0 });
        }
      });
      await transactionAPI.getIncomeTotal(userId, dates).then((json) => {
        if (json[0]) {
          this.setState({ incomeTotal: ((json[0].incomeTotal) / 100).toFixed(2) });
        } else {
          this.setState({ incomeTotal: 0 });
        }
      });

      stateChange(true);
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
    const { userId } = this.state;
    const { dates } = this.props;
    transactionAPI.get(userId, dates).then((json) =>
      this.setState({ transactions: json }));
    this.setState({
      selectedTransaction: null,
    });
    this.handleDisableModal();
  }

  handleEnableModal(transaction) {
    // eslint-disable-next-line no-param-reassign
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
    const { selectedTransaction } = this.state;
    const validatedExpense = selectedTransaction;
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
    const { selectedTransaction } = this.state;
    const validatedIncome = selectedTransaction;
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
    const {
      showExpenseModal,
      showIncomeModal,
      errors,
      selectedTransaction,
      transactions,
      spendingTotal,
      incomeTotal
    } = this.state;
    return (
      <Container>
        <Row>
          <div>
            <AddExpenseModal
              show={showExpenseModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedexpense={selectedTransaction}
              errors={errors}
              datechange={this.handleDateChange}
            />
            <AddIncomeModal
              show={showIncomeModal}
              onHide={this.handleDisableModal}
              onSubmit={this.handleSave}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              selectedincome={selectedTransaction}
              errors={errors}
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
              {transactions.map((transaction) =>
                (
                  <Transaction
                    transaction={transaction}
                    key={transaction._id}
                    onSelect={this.handleSelect}
                    selectedTransaction={selectedTransaction}
                    onDelete={this.handleDelete}
                  />
                ))}
              <tr>
                <th>Total Amount Spent</th>
                <th>
                  $
                  {spendingTotal}
                </th>
                <th>Total Income</th>
                <th>
                  $
                  {incomeTotal}
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
