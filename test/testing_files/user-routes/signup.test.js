const common = require("../../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;
const dateformat = common.dateformat;

const User = common.User;
const testUserId = common.options.testUserId;
const anotherObjectId = common.options.anotherObjectId;

beforeEach(function (done) {
    assert.isFulfilled(User.deleteMany({}), Error).notify(done);
});

it("should create a new user", function(done) {
    var testUser = User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(), 
        password: faker.internet.password()
    });
    chai.request(app)
        .post(`/api/signup`)
        .send(testUser)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.success).to.equal(true);
            expect(res.body.message).to.equal('Signed up');
            done();
        });
});

describe("Bad POSTS", function() {
    it("should fail when missing firstName", function(done) {
        var badTestUser = User({
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
            password: faker.internet.password()
        });
        chai.request(app)
            .post(`/api/signup`)
            .send(badTestUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: First name cannot be blank.');
                done();
            });
    }); 
    it("should fail when missing lastName", function(done) {
        var badTestUser = User({
            firstName: faker.name.firstName(),
            email: faker.internet.email(), 
            password: faker.internet.password()
        });
        chai.request(app)
            .post(`/api/signup`)
            .send(badTestUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Last name cannot be blank.');
                done();
            });
    }); 

    it("should fail when missing Email", function(done) {
        var badTestUser = User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password()
        });
        chai.request(app)
            .post(`/api/signup`)
            .send(badTestUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Email cannot be blank.');
                done();
            });
    }); 
    
    it("should fail if email is not an email", function(done) {
        var badTestUser = User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.random.word(), 
            password: faker.internet.password()
        });
        chai.request(app)
            .post(`/api/signup`)
            .send(badTestUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Email must be in the correct format.');
                done();
            });
    }); 

    it("should fail when missing password", function(done) {
        var badTestUser = User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
        });
        chai.request(app)
            .post(`/api/signup`)
            .send(badTestUser)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Password cannot be blank.');
                done();
            });
    }); 

    it("should fail if there is already a user with that email", function(done){
        let email = faker.internet.email();
        let user = [{
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: email,
            password: faker.internet.password(),
            resetPasswordToken: ''
        }]
        let duplicateUser ={
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: email,
            password: faker.internet.password(),
        }
        User.insertMany(user)
        .then((userRes) => {
            chai.request(app)
                .post('/api/signup')
                .send(duplicateUser)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.equal(false);
                    expect(res.body.message).to.equal('Error: Account already exists');
                    done();
                });
        });
    });
});