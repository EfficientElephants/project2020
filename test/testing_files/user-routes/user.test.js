const common = require("../../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;
const crypto = common.crypto;

const User = common.User;
const anotherObjectId = common.options.anotherObjectId;

beforeEach(function (done) {
    assert.isFulfilled(User.deleteMany({}), Error).notify(done);
});

describe("User ID", function(){
    it("should successfully get user's ID", function(done){
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
                .get(`/api/getUserId?token=${savedUser._id}`)
                .end((err, res)=>{
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal('Valid Session');
                    expect(res.body.userId).to.equal(savedUser._id);
                    done();
                })
        });
    });
    it("should fail if user is not in database", function(done){
        chai.request(app)
            .get(`/api/getUserId?token=${anotherObjectId}`)
            .end((err, res)=>{
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('Error: Invalid Session');
                done();
            });
    })
});

describe("User Information", function(){
    it("should get all user's information", function(done) {
        let plainPassword = faker.internet.password();
        let firstName = faker.name.firstName()
        let lastName = faker.name.lastName()
        let user = new User({
            firstName: firstName,
            lastName: lastName,
            email: faker.internet.email(firstName, lastName), 
        });
        user.password = user.generateHash(plainPassword);
        user.save(function(err, user) {
            savedUser = JSON.parse(JSON.stringify(user));
            console.log(savedUser);
            chai.request(app)
                .get(`/api/users/${savedUser._id}`)
                .end((err, res)=>{
                    console.log(res.body);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.deep.equal(savedUser);
                    done();
                });
        });
    });
    it("should fail if user not in database", function(done){
        console.log(anotherObjectId)
        chai.request(app)
        .get(`/api/users/${anotherObjectId}`)
        .end((err, res)=>{
            console.log(res.body);
            expect(res.statusCode).to.equal(401);
            expect(res.body.message).to.equal("User doesn't exist");
            done();
        });
    })
});