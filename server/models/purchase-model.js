const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')

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
    createdAt: Date,
    updatedAt: Date
});


purchaseSchema.pre('save', function (next) {
    let now = Date.now()
     
    this.updatedAt = now
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now
    }
    
    // Call the next function in the pre-save chain
    next()    
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