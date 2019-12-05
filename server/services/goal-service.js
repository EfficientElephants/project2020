const Goal = require('../models/goal-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId } = query;
  const docquery = Goal.find({userId: userId}).sort({createdAt: 'descending'}).read(ReadPreference.NEAREST);
  return docquery
    .then(goals => {
      res.json(goals);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function create(req, res) {
  const { category, goalAmount, spentAmount } = req.body;
  const { query } = req;
  const { userId } = query;
  const goal = new Goal({ userId, category, goalAmount, spentAmount });
  goal
    .save()
    .then(() => {
      res.json(goal);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  }
  

function update(req, res) {
  const { category, goalAmount, spentAmount, _id} = req.body;

  Goal.findOne({ _id })
  .then(goal => {
    goal.category = category;
    goal.goalAmount = goalAmount;
    goal.spentAmount = spentAmount;
    goal.updatedAt = Date.now();
    goal.save().then(res.json(goal));
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

function destroy(req, res) {
  const { _id } = req.params;

  Goal.findOneAndRemove({ _id })
    .then(goal => {
      res.json(goal);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy };