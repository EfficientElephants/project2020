var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

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


exports.User = require('../server/models/user-model');