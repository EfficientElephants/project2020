import mongoose, { model } from 'mongoose';
import { isIn } from 'validator';

const { Schema } = mongoose;
function getPrice(num) {
    return (num / 100).toFixed(2);
}

function setPrice(num) {
    return num * 100;
}

const now = Date.now();
const date = new Date();
const transactionSchema = new Schema({
    userId: {
        type: String,
        default: '',
        required: true,
    },
    date: {
        type: Date,
        default: date,
        required: true,
    },
    item: {
        type: String,
        required: true,
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
            return isIn(value, [
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
            ]);
        },
    },
    transactionType: {
        type: String,
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
    monthYearId: {
        type: String,
        required: true,
    },
});

transactionSchema.set('toObject', { getters: true });
transactionSchema.set('toJSON', { getters: true });
const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;
