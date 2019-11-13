const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({
    email: { type: String, 
        lowercase: true,
        required: true,
        index: true, 
        unique: true, 
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        index: true,
        unqiue:true,
    },
    password: {
        type: String,
        required: true,
        length: {
            min: 8,
            max: 14
        }
    }
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;