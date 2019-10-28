var express = require('express');
var router = express.Router();

var userService = require('../user-service');

router.get('/users', function(req, res) {
  userService.get(req,res);
});

router.post('/hero', function(req, res) {
  heroesService.create(req, res);
});

// router.put('/hero', function(req, res) {
//   heroesService.update(req, res);
// });

// router.delete('/hero/:id', function(req, res) {
//   heroesService.destroy(req, res);
// });

module.exports = router;