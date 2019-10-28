var express = require('express');
var router = express.Router();

var userService = require('../user-service');

router.get('/users', function(req, res) {
  userService.get(req,res);
});

router.post('/user', function(req, res) {
  userService.create(req, res);
});

router.put('/user', function(req, res) {
  userService.update(req, res);
});

router.delete('/user/:id', function(req, res) {
  userService.destroy(req, res);
});

module.exports = router;