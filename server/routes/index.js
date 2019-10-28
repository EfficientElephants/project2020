var express = require('express');
var router = express.Router();

var userService = require('../user-service');
router.get('/users', function(req, res, next) {
  userService.get(req,res);
});

module.exports = router;