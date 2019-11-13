var express = require('express');
var router = express.Router();

var userService = require('../services/user-service');

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

module.exports = router;