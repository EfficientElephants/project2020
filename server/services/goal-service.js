const { ReadPreference } = require('mongodb');
const Goal = require('../models/goal-model');

function get(req, res) {
  const { userId, mmyyID } = req.params;
  let docquery;
  if (mmyyID === 'all') {
    docquery = Goal.find({ userId }).sort({ createdAt: 'descending' }).read(ReadPreference.NEAREST);
  } else {
    docquery = Goal.find({ userId, monthYearId: mmyyID }).sort({ createdAt: 'descending' }).read(ReadPreference.NEAREST);
  }
  return docquery
    .then((goals) => {
      res.json(goals);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { category, goalAmount, spentAmount } = req.body;
  const { query } = req;
  const { userId } = query;
  const date = new Date();

  // Logic to create month and year ids for new goals
  const year = date.getFullYear() - 2000;
  const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
  const mmyyID = (month + year).toString();
  const metGoal = (!(goalAmount < spentAmount));
  const goal = new Goal({
    userId,
    category,
    goalAmount,
    spentAmount,
    metGoal,
    monthYearId: mmyyID,
    createdAt: date,
    updatedAt: date
  });
  goal
    .save()
    .then(() => {
      res.json(goal);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}


function update(req, res) {
  const { category, goalAmount, spentAmount, _id } = req.body;

  Goal.findOne({ _id })
    .then((resgoal) => {
      const goal = resgoal;
      goal.category = category;
      goal.goalAmount = goalAmount;
      goal.spentAmount = spentAmount;
      const metGoal = (!(goalAmount < spentAmount));
      goal.metGoal = metGoal;
      goal.updatedAt = Date.now();
      goal
        .save()
        .then(() => {
          res.json(goal);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function destroy(req, res) {
  const { _id } = req.params;
  Goal.findOneAndRemove({ _id })
    .then((goal) => {
      if (!goal) {
        res.status(400).send('Goal Not Found');
      } else {
        res.json(goal);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getAllCategories(req, res) {
  const { userId } = req.params;
  const docquery = Goal.find({ userId }).distinct('category').read(ReadPreference.NEAREST);
  return docquery
    .then((goals) => {
      res.json(goals);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy, getAllCategories };
