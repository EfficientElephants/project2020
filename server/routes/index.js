var express = require('express');
var router = express.Router();

var userService = require('../services/user-service');
var transactionService = require('../services/transaction-service');
var signupService = require('../services/signup-service');
var loginService = require('../services/login-service');
var logoutService = require('../services/logout-service');
var getUserIdService = require('../services/get-userId-service');
var goalService = require('../services/goal-service');

// router.get('/users', function(req, res) {
//   userService.get(req,res);
// });

// router.post('/user', function(req, res) {
//   userService.create(req, res);
// });

// router.put('/user', function(req, res) {
//   userService.update(req, res);
// });

// router.delete('/user/:email', function(req, res) {
//   userService.destroy(req, res);
// });

//add transaction routes
router.get('/transactions', function(req, res) {
  transactionService.get(req,res);
});

router.post('/transaction', function(req, res) {
  transactionService.create(req, res);
});

router.put('/transaction', function(req, res) {
  transactionService.update(req, res);
});

router.delete('/transaction/:_id', function(req, res) {
  transactionService.destroy(req, res);
});

router.get('/transaction/totals/:userId/:dates', function(req, res) {
  transactionService.getTotalsAll(req, res);
});

router.get('/transaction/spendingTotal/:userId/:dates', function(req, res) {
  transactionService.getSpendingTotal(req, res);
});
router.get('/transaction/incomeTotal/:userId/:dates', function(req, res) {
  transactionService.getIncomeTotal(req, res);
});

//signup
router.post('/signup', function(req, res) {
  signupService.signup(req, res);
});

//login
router.post('/login', function(req, res) {
  loginService.login(req, res);
});

// Verify token on login and page refresh
router.get('/verify', function(req, res) {
  loginService.verify(req, res);
});

//logout
router.get('/logout', function(req, res) {
  logoutService.logout(req, res);
});

// must also send token from local storage
router.get('/getUserId', function(req, res) {
  getUserIdService.getUserId(req, res);
});

//Get user's name
router.get('/users/:userId', function(req, res){
  getUserIdService.getUserName(req, res);
});

//goal
router.get('/goals/:userId/:mmyyID', function(req, res) {
  goalService.get(req,res);
});

router.post('/goal', function(req, res) {
  goalService.create(req, res);
});

router.put('/goal', function(req, res) {
  goalService.update(req, res);
});

router.delete('/goal/:_id', function(req, res) {
  goalService.destroy(req, res);
});

module.exports = router;