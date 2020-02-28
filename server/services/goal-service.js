const Goal = require('../models/goal-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { userId, mmyyID } = req.params
  console.log(userId);
  console.log(typeof parseInt(mmyyID));
  const docquery = Goal.find({userId: userId, monthYearId: mmyyID}).sort({createdAt: 'descending'}).read(ReadPreference.NEAREST);
  return docquery
    .then(goals => {
      console.log(goals)
      res.json(goals);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

// function getOnMYid (req, res) {
//   console.log(req);
//   const {userId, mmyyId} = req.params;
//   const docs = Goal.find({userId: userId, monthYearId: mmyyId}).read(ReadPreference.NEAREST);
//   return docs
//     .then(goals => {
//       res.json(goals);
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     })
// }

function create(req, res) {
  const { category, goalAmount, spentAmount } = req.body;
  const { query } = req;
  const { userId } = query;
  const date = new Date();

  //Logic to create month and year ids for new goals
  var year = date.getFullYear() - 2000
  var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
  console.log(month);
  const mmyyID = (month + year).toString();
  const metGoal = (goalAmount < spentAmount ? false : true)
  const goal = new Goal({ userId, category, goalAmount, spentAmount, metGoal, monthYearId: mmyyID });
  console.log(goal);
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