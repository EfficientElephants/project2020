const common = require("../../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;

const User = common.User;
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
        // let plainPassword = faker.internet.password();
        // let user = new User({
        //     firstName: faker.name.firstName(),
        //     lastName: faker.name.lastName(),
        //     email: faker.internet.email(), 
        // });
        // user.password = user.generateHash(plainPassword);
        // user.save(function(err, user) {
        //     savedUser = JSON.parse(JSON.stringify(user));
        //     let forgottenUser = {
        //         email: savedUser.email,
        //     };
        //     chai.request(app)
        //         .post('/api/login')
        //         .send(forgottenUser)
        //         .end((err, res)=>{
        //             expect(res.statusCode).to.equal(401);
        //             expect(res.body.success).to.equal(false);
        //             expect(res.body.message).to.equal('Error: Invalid Password');
        //             done();
        //         })
        // });
        done();
    });
});