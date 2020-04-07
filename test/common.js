const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const chaiExclude = require('chai-exclude');

chai.use(chaiExclude);

// put things that need to be passed as variables/options in here
const options = {
  testUserId: require('mongoose').Types.ObjectId().toHexString(),
  anotherObjectId: require('mongoose').Types.ObjectId().toHexString(),
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
