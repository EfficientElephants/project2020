var common = require('./common');
const monogConn = common.mongoConn;

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe('Server Tests', function() {
    this.timeout(2500);

    before(function(done){
        monogConn.connect()
        .then(() => done())
        .catch((err) => done(err));
    });
    after(function(done){
        monogConn.close()
        .then(() => done())
        .catch((err) => done(err));
    });

    // importTest("Testing Transaction Routes", './testing_files/transaction-routes.test.js');
    // importTest("Testing Goal Routes", './testing_files/goal-routes.test.js');
    describe("Testing User Routes", function() {
        importTest("Signup Testing", './testing_files/user-routes/signup.test.js');
    });
});
