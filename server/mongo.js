const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoURI = process.env.connection_string2;


function connect() {
    return mongoose.connect(mongoURI, {useFindAndModify: false, autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

}

module.exports = {
    connect,
    mongoose
};