//Not in use--should delete at some point

const User = require('../models/user-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const docquery = User.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { email, firstName, lastName, googleId } = req.body;

  const user = new User({ email, firstName, lastName, googleId });
  user
    .save()
    .then(() => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function update(req, res) {
  const { email, firstName, lastName, googleId } = req.body;

  User.findOne({ email })
    .then(user => {
      user.firstName = firstName;
      user.lastName = lastName;
      user.googleId = googleId;
      user.save().then(res.json(user));
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function destroy(req, res) {
  const { email } = req.params;

  User.findOneAndRemove({ email })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy };