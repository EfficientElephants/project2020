#!/usr/bin/env node
var app = require('./app');
var db = require('./mongo');

var port = process.env.PORT || '3001';

db.connect()
.then(() => {
  app.listen(port, () => {
    console.log('Listening on port: ' + port);
  });
});