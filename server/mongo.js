const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongoURI = ''
if(process.env.NODE_ENV == 'dev'){
    mongoURI = process.env.CONNECTION_STRING;
}else if(process.env.NODE_ENV == 'test'){
    mongoURI = process.env.CONNECTION_STRING_TESTING;
}


function connect() {
    return mongoose.connect(mongoURI, {useFindAndModify: false, autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

}

module.exports = {
    connect,
    mongoose
};