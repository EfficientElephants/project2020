const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const validator = require('validator')
// var uniqueValidator = require('mongoose-unique-validator');
const userSessionSchema = new Schema({
    userId: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    isLoggedOut: {
        type: Boolean,
        default: false
    }
});

// userSchema.plugin(uniqueValidator);
const UserSession = mongoose.model('UserSession', userSessionSchema);
module.exports = UserSession;