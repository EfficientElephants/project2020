const common = require("../../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;
const crypto = common.crypto;

const User = common.User;
const testUserId = common.testUserId;
const anotherObjectId = common.options.anotherObjectId;

beforeEach(function (done) {
    assert.isFulfilled(User.deleteMany({}), Error).notify(done);
});

describe("Login", function() {
    it("should let user login", function(done){
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            let loginUser = {
                email: savedUser.email,
                password: plainPassword
            };
            chai.request(app)
                .post('/api/login')
                .send(loginUser)
                .end((err, res)=>{
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Valid login');
                    expect(res.body.token).to.equal(savedUser._id);
                    done();
                })
        });
    });

    it("should fail if email doesn't exist", function(done) {
        let plainPassword = faker.internet.password();
        let loginUser = {
            email: faker.internet.email(),
            password: plainPassword
        };
        chai.request(app)
            .post('/api/login')
            .send(loginUser)
            .end((err, res)=>{
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Username');
                done();
            });
    });
    it("should fail if user exists but incorrect password", function(done){
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            let loginUser = {
                email: savedUser.email,
                password: faker.internet.password()
            };
            chai.request(app)
                .post('/api/login')
                .send(loginUser)
                .end((err, res)=>{
                    expect(res.statusCode).to.equal(401);
                    expect(res.body.success).to.equal(false);
                    expect(res.body.message).to.equal('Error: Invalid Password');
                    done();
                })
        });
    });
});

describe("Verify", function(){
    it("should verify that token is in database", function(done){
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            chai.request(app)
                .get(`/api/verify?token=${savedUser._id}`)
                .end((err, res)=>{
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Valid Session');
                    done();
                })
        });
    });
    it("should fail if user is not in database", function(done){
        chai.request(app)
            .get(`/api/verify?token=${anotherObjectId}`)
            .end((err, res)=>{
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Session');
                done();
            });
    })
});

describe("ForgotPassword", function() {
    it("should send user set password", function(done){
        this.timeout(5000);
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: process.env.TESTING_EMAIL, 
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            let forgottenUser = {
                email: savedUser.email,
            };
            chai.request(app)
                .post('/api/forgotPassword')
                .send(forgottenUser)
                .end((err, res)=>{
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Password reset email sent');
                    done();
                })
        });
    });
    
    it("should fail if user does not exist", function(done) {
        let forgottenUser = {
            email: faker.internet.email()
        };
        chai.request(app)
            .post('/api/forgotPassword')
            .send(forgottenUser)
            .end((err, res)=>{
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Email');
                done();
            });
    });
});

describe("Verify Reset Token", function() {
    it("should have the correct password reset token", function(done) {
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
            resetPasswordToken: crypto.randomBytes(20).toString('hex')
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            chai.request(app)
                .get(`/api/verifyReset?token=${savedUser.resetPasswordToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Token Verified');
                    expect(res.body.token).to.equal(savedUser.resetPasswordToken)
                    done();
                })
        });
    });
    it("should fail if user doesn't exist", function(done) {
        let resetPasswordToken =  crypto.randomBytes(20).toString('hex')
        chai.request(app)
            .get(`/api/verifyReset?token=${resetPasswordToken}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Session');
                done();
            });
        });
});

describe("Reset Password", function() {
    it("should sucessfully reset a password", function(done){
        let plainPassword = faker.internet.password();
        let user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(), 
            resetPasswordToken: crypto.randomBytes(20).toString('hex')
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            resettingPassword = {
                newPassword: faker.internet.password(),
                token: savedUser.resetPasswordToken
            }
            chai.request(app)
                .post(`/api/resetPassword`)
                .send(resettingPassword)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Password is updated');
                    done();
                })
        });
    });

    it("should fail if user doesn't exist", function(done) {
        resettingPassword = {
            newPassword: faker.internet.password(),
            token: crypto.randomBytes(20).toString('hex')
        }
        chai.request(app)
            .post(`/api/resetPassword`)
            .send(resettingPassword)
            .end((err, res) => {
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Session');
                done();
            })
    });
});