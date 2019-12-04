var express = require('express');
var router = express.Router();

var userService = require('../services/user-service');
var purchaseService = require('../services/purchase-service');
var incomeService = require('../services/income-service');
var signupService = require('../services/signup-service');
var loginService = require('../services/login-service');
var logoutService = require('../services/logout-service');
var getUserIdService = require('../services/get-userId-service');

router.get('/users', function(req, res) {
  userService.get(req,res);
});

router.post('/user', function(req, res) {
  userService.create(req, res);
});

router.put('/user', function(req, res) {
  userService.update(req, res);
});

router.delete('/user/:email', function(req, res) {
  userService.destroy(req, res);
});

//add purchase routes
router.get('/purchases', function(req, res) {
  purchaseService.get(req,res);
});

router.post('/purchase', function(req, res) {
  purchaseService.create(req, res);
});

router.put('/purchase', function(req, res) {
  purchaseService.update(req, res);
});

router.delete('/purchase/:_id', function(req, res) {
  purchaseService.destroy(req, res);
});

//add income routes
// router.get('/incomes', function(req, res) {
//   incomeService.get(req,res);
// });

// router.post('/income', function(req, res) {
//   incomeService.create(req, res);
// });

// router.put('/income', function(req, res) {
//   incomeService.update(req, res);
// });

// router.delete('/income/:_id', function(req, res) {
//   incomeService.destroy(req, res);
// });

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

module.exports = router;