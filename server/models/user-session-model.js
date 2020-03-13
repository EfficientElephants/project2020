const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const UserSession = mongoose.model('UserSession', userSessionSchema);
module.exports = UserSession;