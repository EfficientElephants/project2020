var express = require('express');
var router = express.Router();

var userService = require('../services/user-service');
var purchaseService = require('../services/purchase-service');
var signupService = require('../services/signup-service');
var loginService = require('../services/login-service');
var logoutService = require('../services/logout-service');

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

//signup
router.post('/signup', function(req, res) {
  signupService.signup(req, res);
});

//login
router.post('/login', function(req, res) {
  loginService.login(req, res);
});

// Verify token on login
router.get('/verify', function(req, res) {
  loginService.verify(req, res);
});

//logout
router.get('/logout', function(req, res) {
  logoutService.logout(req, res);
});

module.exports = router;