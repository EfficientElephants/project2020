var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var chaiHttp = require('chai-http');
chai.use(chaiHttp)
const chaiNock = require('chai-nock');
chai.use(chaiNock);
var chaiExclude = require('chai-exclude');
chai.use(chaiExclude);

var nock = require('nock');

var dateformat = require('dateformat');
var moment = require('moment');

const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

var MockDate = require('mockdate');

//put things that need to be passed as variables/options in here
var options = {
    userpassword: process.env.CORRECT_USER_TEST_PASS
};

exports.thisMonthFood = 0;

exports.options = options;
exports.chai = chai;
exports.assert = chai.assert;
exports.expect = chai.expect;
exports.schema = mongoose.Schema
exports.nock = nock;
exports.dateformat = dateformat;
exports.moment = moment;
exports.mockdate = MockDate;

exports.app = require('../server/app');
exports.Transaction = require('../server/models/transaction-model');
exports.Goal = require('../server/models/goal-model');
exports.loginResponse = require('./response.json');