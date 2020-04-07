/* eslint-disable global-require */
/* eslint-disable func-names */
const common = require('./common');

const monogConn = common.mongoConn;

function importTest(name, path) {
  describe(name, () => {
    // eslint-disable-next-line import/no-dynamic-require
    require(path);
  });
}

describe('Server Tests', function () {
  this.timeout(2500);

  before((done) => {
    monogConn.connect()
      .then(() =>
        done())
      .catch((err) =>
        done(err));
  });
  after((done) => {
    monogConn.close()
      .then(() =>
        done())
      .catch((err) =>
        done(err));
  });

  importTest('Testing Transaction Routes', './testing_files/transaction-routes.test.js');
  importTest('Testing Goal Routes', './testing_files/goal-routes.test.js');
  describe('Testing User Routes', () => {
    importTest('Signup Service', './testing_files/user-routes/signup.test.js');
    importTest('Login Service', './testing_files/user-routes/login.test.js');
    importTest('UserId Service', './testing_files/user-routes/user.test.js');
  });
});
