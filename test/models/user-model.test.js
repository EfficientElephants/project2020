var common = require("../common");
var options = common.options;
var assert = common.assert;
var User = common.User;

///User Database Testing

//Need to remove all entries before starting tests
before(function (done) {
    assert.isFulfilled(User.deleteMany({}), Error).notify(done);
});

it('Save test user', function(done){
    var testUser = User({
        firstName: "Test",
        lastName: "Tester",
        email: "test@test.com"
    });
    testUser.password = testUser.generateHash(options.userpassword);
    assert.isFulfilled(testUser.save()).notify(done);
});

describe("Don't save in database incorrectly", function() {
    it("Don't save is missing required information", function(done) {
        var incorrectUser1 = User({
            firstName: "Only First Name"
        })
        assert.isRejected(incorrectUser1.save(), Error).notify(done);
    });

    it("Don't save user with same email", function(done){
        var incorrectUser2 = User({
            firstName: "Testing 2",
            lastName: "Test",
            email: "test@test.com"
        });
        incorrectUser2.password = incorrectUser2.generateHash(options.userpassword);
        assert.isRejected(incorrectUser2.save(), Error).notify(done);
    });

    it("Don't save if email is not an email", function(done){
        var incorrectUser3 = User({
            firstName: "Testing 3",
            lastName: "Test",
            email: "test3"
        });
        incorrectUser3.password = incorrectUser3.generateHash(options.userpassword);
        assert.isRejected(incorrectUser3.save(), Error).notify(done);
    });
});