var express = require('express');
var router = express.Router();

router.get('/users', function(req, res, next) {
  const users = [
    {
      id: 0, 
      name:"MaddieTest", 
      password:"pass"
    }
  ];

  res.json(users);
});

module.exports = router;