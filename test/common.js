var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var chaiHttp = require('chai-http');
chai.use(chaiHttp)

const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

//put things that need to be passed as variables/options in here
var options = {
    userpassword: process.env.CORRECT_USER_TEST_PASS
};

exports.options = options;
exports.chai = chai;
exports.assert = chai.assert;
exports.expect = chai.expect;
exports.schema = mongoose.Schema

exports.app = require('../server/app');
exports.User = require('../server/models/user-model');
exports.Transaction = require('../server/models/transaction-model');