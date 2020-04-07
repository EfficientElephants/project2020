const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const chaiExclude = require('chai-exclude');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

chai.use(chaiHttp);

chai.use(chaiExclude);

// put things that need to be passed as variables/options in here

const options = {
  testUserId: mongoose.Types.ObjectId().toHexString(),
  anotherObjectId: mongoose.Types.ObjectId().toHexString(),
};

exports.options = options;
exports.chai = chai;
exports.assert = chai.assert;
exports.expect = chai.expect;
exports.faker = require('faker');
exports.dateformat = require('dateformat');
exports.mongoose = require('mongoose');
exports.mockdate = require('mockdate');
exports.crypto = require('crypto');

exports.mongoConn = require('../server/mongo');
exports.app = require('../server/app');
exports.Transaction = require('../server/models/transaction-model');
exports.Goal = require('../server/models/goal-model');
exports.User = require('../server/models/user-model');
