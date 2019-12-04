const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')

const now = Date.now()
const purchaseSchema = new Schema({
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
            return validator.isIn(value, ['Rent', 'Food', 'Social', 'Medical', 'Transportation', 'Personal Care'])
        }
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

purchaseSchema.set('toObject', { getters: true });
purchaseSchema.set('toJSON', { getters: true });
const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;