const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const now = Date.now();
function getGoal(num) {
  return (num / 100).toFixed(2);
}

function setGoal(num) {
  return num * 100;
}

const goalSchema = new Schema({
  userId: {
    type: String,
    default: '',
    required: true,
  },
  category: {
    type: String,
    required: true,
    validate: (value) =>
      validator.isIn(value, [
        'Income',
        'Housing',
        'Food',
        'Social',
        'Healthcare',
        'Transportation',
        'Personal Spending',
        'Education',
        'Utilities',
        'Misc.',
      ]),
  },
  goalAmount: {
    type: Number,
    required: true,
    get: getGoal,
    set: setGoal,
  },
  spentAmount: {
    type: Number,
    required: true,
    get: getGoal,
    set: setGoal,
  },
  monthYearId: {
    type: String,
    required: true,
  },
  metGoal: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: now,
  },
  updatedAt: {
    type: Date,
    default: now,
  },
});

goalSchema.set('toObject', { getters: true });
goalSchema.set('toJSON', { getters: true });
goalSchema.index({ userId: 1, category: 1, monthYearId: 1 }, { unique: true });
goalSchema.plugin(uniqueValidator);
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
