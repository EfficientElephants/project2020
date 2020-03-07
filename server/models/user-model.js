const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        default: ''
    },
    email: { 
        type: String, 
        lowercase: true,
        required: true,
        index: true, 
        unique: true, 
        validate: (value) => {
            return validator.isEmail(value)
        },
        default: ''
    },
    googleId: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }


});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;