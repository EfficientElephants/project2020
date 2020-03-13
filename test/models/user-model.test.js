var common = require("../common");
var options = common.options;
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
var nock = common.nock;

var Transaction = common.Transaction;


var body = require('../body.json');
var response = require('../response.json')
//const nock = require('nock')

//var transactionAPI = require('../../src/api/transactionAPI')

//console.log(response);
 

//console.log(scope)
//testUser = scope

var testToken = (response).token;
//console.log(testToken);

// test Transactions

describe("Transaction Route Testing", function() {
    before(function (done) {
        assert.isFulfilled(Transaction.deleteMany({}), Error).notify(done);
    });

    describe("GET", function() {
        it('No Transactions for testUser, date = "all"', function(done){
            chai.request(app)
                .get(`/api/transactions?userId=${testToken}&dates=all`)
                // .send({userId: testToken})
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.of.length(0);
                    done();
                })
        });

        it('No Transactions for testUser, date = undefined', function(done){
            chai.request(app)
                .get(`/api/transactions?userId=${testToken}`)
                // .send({userId: testToken})
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.of.length(0);
                    done();
                })
        });

        it("Should return an error", function(done) {
            const requestNock = nock('http://localhost:3001')
                .get(`/api/transactions?userId=${testToken}`)
                .reply(500);
            
            return chai.request(app)
                    .get(`/api/transactions?userId=${testToken}`)
                    .end((err, res) => {
                        expect(requestNock).to.have.been.requested;
                        expect(res.statusCode).to.equal(500);
                        //console.log(res);
                        //done();
                    });
        });
    });
});

                // return request(app)
                // .get('/user/akambi/repos')
                // .set('Accept', 'application/json')
                // .expect('Content-Type', /json/)
                // .expect(200)
                // .then(response => {
                //     console.log(response.body);
                //     expect(response.body).to.deep.equal(githubRepos);
                // });
            // const requestNock = nock('http://bbc.co.uk')
            //     .get('/')
            //     .reply(200);
            
            // request({
            //     json: true,
            //     uri: 'http://bbc.co.uk',
            //     body: {
            //     hello: 'world'
            //     }
            // });
            
            // return expect(requestNock).to.have.been.requestedWith({ hello: 'world' });


    
    
    // it('Post a transaction', function(done) {
    //     chai.request(app)
    //         .post(`/api/transaction?userId=${testToken}`)
    //         .send({
    //             item: "Potato",
    //             date: new Date(),
    //             price: "5.90",
    //             category: "Food",
    //             transactionType: "expense",
    //             monthYearId: "0320"
    //         })
    //         .end((err, res) => {
    //             console.log(res.body);
    //             expect(res.statusCode).to.equal(200);
    //             done()
    //         })
    // })
    

// })











// var User = common.User;

// ///User Database Testing

// //Need to remove all entries before starting tests
// before(function (done) {
//     assert.isFulfilled(User.deleteMany({}), Error).notify(done);
// });

// it('Save test user', function(done){
//     var testUser = User({
//         firstName: "Test",
//         lastName: "Tester",
//         email: "test@test.com"
//     });
//     testUser.password = testUser.generateHash(options.userpassword);
//     assert.isFulfilled(testUser.save()).notify(done);
// });

// describe("Don't save in database incorrectly", function() {
//     it("Don't save if missing required information", function(done) {
//         var incorrectUser1 = User({
//             firstName: "Only First Name"
//         })
//         assert.isRejected(incorrectUser1.save(), Error).notify(done);
//     });

//     it("Don't save user with same email", function(done){
//         var incorrectUser2 = User({
//             firstName: "Testing 2",
//             lastName: "Test",
//             email: "test@test.com"
//         });
//         incorrectUser2.password = incorrectUser2.generateHash(options.userpassword);
//         assert.isRejected(incorrectUser2.save(), Error).notify(done);
//     });

//     it("Don't save if email is not an email", function(done){
//         var incorrectUser3 = User({
//             firstName: "Testing 3",
//             lastName: "Test",
//             email: "test3"
//         });
//         incorrectUser3.password = incorrectUser3.generateHash(options.userpassword);
//         assert.isRejected(incorrectUser3.save(), Error).notify(done);
//     });
// });
