const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function connect() {
    var mongoURI;
    if (process.env.NODE_ENV === 'test') {
        mongoURI = process.env.CONNECTION_STRING_TESTING;
    }else{
        mongoURI = process.env.CONNECTION_STRING;
    }
    return mongoose.connect(mongoURI, {useFindAndModify: false, autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
}

function close() {
    return mongoose.disconnect();
}

module.exports = {
    connect,
    close
};