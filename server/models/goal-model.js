const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const now = Date.now()
const goalSchema = new Schema({
    userId: {
        type: String,
        default: '',
        required: true
    },
    category: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isIn(value, ['Income', 'Housing', 'Food', 'Social', 'Healthcare', 'Transportation', 'Personal Spending', 'Education', 'Utilities', 'Misc.'])
        }
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
    createdAt: {
        type: Date,
        default: now
    },
    updatedAt: {
        type: Date,
        default: now
    },
})

function getGoal(num){
    return (num/100).toFixed(2);
}

function setGoal(num){
    return num*100;
}

goalSchema.set('toObject', { getters: true });
goalSchema.set('toJSON', { getters: true });
goalSchema.index( { userId: 1, category: 1 }, { unique: true } )
goalSchema.plugin(uniqueValidator);
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;