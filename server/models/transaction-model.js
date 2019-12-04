const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')

const now = Date.now()
const transactionSchema = new Schema({
    userId: {
        type: String,
        default: '',
        required: true
    },
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        get: getPrice,
        set: setPrice,
    },
    category: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isIn(value, ['Income', 'Rent', 'Food', 'Social', 'Medical', 'Transportation', 'Personal Care'])
        }
    },
    transactionType: {
        type: String,
        requried: true
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

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

transactionSchema.set('toObject', { getters: true });
transactionSchema.set('toJSON', { getters: true });
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;