var express = require('express');
var router = express.Router();

var userService = require('../services/user-service');
var purchaseService = require('../services/purchase-service');

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

router.delete('/purchase/:createdAt', function(req, res) {
  purchaseService.destroy(req, res);
})

module.exports = router;