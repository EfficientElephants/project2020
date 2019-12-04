const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')

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
            return validator.isIn(value, ['Income', 'Rent', 'Food', 'Social', 'Medical', 'Transportation', 'Personal Care'])
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
const Goals = mongoose.model('Goals', goalSchema);
module.exports = Goals;