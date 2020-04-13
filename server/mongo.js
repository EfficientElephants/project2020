require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function connect() {
  let mongoURI;
  if (process.env.NODE_ENV === 'test') {
    mongoURI = process.env.CONNECTION_STRING_TESTING;
  } else if (process.env.NODE_ENV === 'dev') {
    mongoURI = process.env.CONNECTION_STRING;
  } else {
    mongoURI = process.env.CONNECTION_STRING_TESTING_PROD;
  }
  return mongoose.connect(mongoURI, {
    useFindAndModify: false,
    autoIndex: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  close,
};
