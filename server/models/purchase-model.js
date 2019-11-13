const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const AutoIncrement = require('mongoose-sequence')(mongoose);

const validator = require('validator')
//ar uniqueValidator = require('mongoose-unique-validator');
const purchaseSchema = new Schema({
    item: {
        type: String,
        required: true
    },

    price: {
        type: Currency,
        required: true
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
//purchaseSchema.plugin(uniqueValidator);

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

const Purchase = mongoose.model('Purchase', purchaseSchema);



module.exports = Purchase;