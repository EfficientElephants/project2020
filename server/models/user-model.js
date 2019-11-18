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
    // username: {
    //     type: String,
    //     lowercase: true,
    //     required: true,
    //     index: true,
    //     unqiue:true,
    //     default: ''
    // },
    password: {
        type: String,
        required: true,
        length: {
            min: 8,
            max: 14
        },
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;