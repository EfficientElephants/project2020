const express = require('express');

const router = express.Router();

const transactionService = require('../services/transaction-service');
const signupService = require('../services/signup-service');
const loginService = require('../services/login-service');
const getUserIdService = require('../services/get-userId-service');
const goalService = require('../services/goal-service');

// add transaction routes
router.get('/transactions', (req, res) => {
  transactionService.get(req, res);
});

router.post('/transaction', (req, res) => {
  transactionService.create(req, res);
});

router.put('/transaction', (req, res) => {
  transactionService.update(req, res);
});

router.delete('/transaction/:_id', (req, res) => {
  transactionService.destroy(req, res);
});

router.get('/transaction/totals/:userId/:dates', (req, res) => {
  transactionService.getTotalsAll(req, res);
});

router.get('/transaction/spendingTotal/:userId/:dates', (req, res) => {
  transactionService.getSpendingTotal(req, res);
});
router.get('/transaction/incomeTotal/:userId/:dates', (req, res) => {
  transactionService.getIncomeTotal(req, res);
});

router.get('/transaction/earliest/:userId', (req, res) => {
  transactionService.earliestTransaction(req, res);
});

// signup
router.post('/signup', (req, res) => {
  signupService.signup(req, res);
});

// reset password
router.post('/resetPassword', (req, res) => {
  loginService.resetPassword(req, res);
});

// verify reset token
router.get('/verifyReset', (req, res) => {
  loginService.verifyResetToken(req, res);
});

// login
router.post('/login', (req, res) => {
  loginService.login(req, res);
});

// Verify token on login and page refresh
router.get('/verify', (req, res) => {
  loginService.verify(req, res);
});

// Send email to reset password
router.post('/forgotPassword', (req, res) => {
  loginService.forgotPassword(req, res);
});

// must also send token from local storage
router.get('/getUserId', (req, res) => {
  getUserIdService.getUserId(req, res);
});

// Get user's name
router.get('/users/:userId', (req, res) => {
  getUserIdService.getUserName(req, res);
});

// goal
router.get('/goals/:userId/:mmyyID', (req, res) => {
  goalService.get(req, res);
});

router.post('/goal', (req, res) => {
  goalService.create(req, res);
});

router.put('/goal', (req, res) => {
  goalService.update(req, res);
});

router.delete('/goal/:_id', (req, res) => {
  goalService.destroy(req, res);
});

router.get('/goal/allCats/:userId/', (req, res) => {
  goalService.getAllCategories(req, res);
});

module.exports = router;
