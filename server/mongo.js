import { connect as _connect, disconnect } from 'mongoose';

require('dotenv').config();

function connect() {
    let mongoURI;
    if (process.env.NODE_ENV === 'test') {
        mongoURI = process.env.CONNECTION_STRING_TESTING;
    } else {
        mongoURI = process.env.CONNECTION_STRING;
    }
    return _connect(mongoURI, {
        useFindAndModify: false,
        autoIndex: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    });
}

function close() {
    return disconnect();
}

export default {
    connect,
    close,
};
