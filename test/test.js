/* eslint-disable global-require */
/* eslint-disable func-names */
const { mongoConn } = require('./common');

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe('Server Tests', function () {
    this.timeout(2500);

    before(function (done) {
        mongoConn
            .connect()
            .then(() => done())
            .catch((err) => done(err));
    });
    after(function (done) {
        mongoConn
            .close()
            .then(() => done())
            .catch((err) => done(err));
    });

    importTest(
        'Testing Transaction Routes',
        './testing_files/transaction-routes.test.js'
    );
    importTest('Testing Goal Routes', './testing_files/goal-routes.test.js');
    describe('Testing User Routes', function () {
        importTest(
            'Signup Service',
            './testing_files/user-routes/signup.test.js'
        );
        importTest(
            'Login Service',
            './testing_files/user-routes/login.test.js'
        );
        importTest(
            'UserId Service',
            './testing_files/user-routes/user.test.js'
        );
    });
});
