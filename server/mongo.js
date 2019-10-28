const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const mongoURI = process.env.CONNECTION_STRING;

function connect() {
    return mongoose.connect(mongoURI, {autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

}

module.exports = {
    connect,
    mongoose
};