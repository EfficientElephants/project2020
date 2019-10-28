const dotenv = require('dotenv').config();
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

const mongoURI = process.env.CONNECTION_STRING;

function connect() {
    return mongoose.connect(mongoURI, {autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

}

module.exports = {
    connect,
    mongoose
};