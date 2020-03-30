var common = require("../common");
var options = common.options;
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
var dateformat = common.dateformat;
var moment = common.moment;
var Transaction = common.Transaction;
var testToken = common.loginResponse.token;

//Initalize Local Variables for this file
var dateToUse = new Date();
var mmyyidToUse = dateformat(dateToUse, 'mmyy')
var transaction = ''
var delTransaction = '';

var totalsAll = 0;
var lastMonthTotal = 0;
var incomeAll = 0;
var lastMonthIncomeTotal = 0;

var foodTotal = 0;
var socialTotal = 0;
var transpoTotal = 0;

//Functions for testing
before(function (done) {
    //appServer = server.listen(3002, done)
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
});

describe("POST", function() {
    it('Post an expense transaction', function(done) {
        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Potato",
                date: dateToUse,
                price: 5.90,
                category: "Food",
                transactionType: "expense",
                monthYearId: mmyyidToUse
            })
            .end((err, res) => {
                totalsAll += (parseFloat(res.body.price) * 100);
                foodTotal += (parseFloat(res.body.price) * 100);
                expect(res.statusCode).to.equal(200);
                done()
            })
    });

    it('Post a second expense transaction', function(done) {
        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Movie",
                date: dateToUse,
                price: 21.34,
                category: "Social",
                transactionType: "expense",
                monthYearId: mmyyidToUse
            })
            .end((err, res) => {
                totalsAll += (parseFloat(res.body.price) * 100);
                socialTotal += (parseFloat(res.body.price) * 100);
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(200);
                done()
            })
    });

    it('Post a third expense transaction', function(done) {
        var lastMonth = moment().subtract(1, 'month').toDate()
        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Gas",
                date: lastMonth,
                price: 28.97,
                category: "Transportation",
                transactionType: "expense",
                monthYearId: dateformat(lastMonth, 'mmyy')
            })
            .end((err, res) => {
                lastMonthTotal += (parseFloat(res.body.price) * 100);
                totalsAll += (parseFloat(res.body.price) * 100);
                transpoTotal += (parseFloat(res.body.price) * 100);
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(200);
                done()
            })
    });

    it('Post an income transaction', function(done){
        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Math Clinic",
                date: new Date(),
                price: 145.00,
                category: "Income",
                transactionType: "income",
                monthYearId: dateformat(new Date(), 'mmyy')
            })
            .end((err, res) => {
                incomeAll += (parseFloat(res.body.price) * 100);
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(200);
                done()
            })

    })

    it('Post a second income transaction', function(done){
        var lastMonth = moment().subtract(1, 'month').toDate()
        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Babysitting",
                date: lastMonth,
                price: 85.00,
                category: "Income",
                transactionType: "income",
                monthYearId: dateformat(lastMonth, 'mmyy')
            })
            .end((err, res) => {
                lastMonthIncomeTotal += (parseFloat(res.body.price) * 100);
                incomeAll += (parseFloat(res.body.price) * 100);
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(200);
                done()
            })
    })

    it('should not post if missing a required value', function(done) {
        var errorMessage = { errors:
            { price:
                { message: 'Path `price` is required.',
                    name: 'ValidatorError',
                    properties: {
                            message: "Path `price` is required.",
                            path: "price",
                            type: "required"
                            },
                    kind: 'required',
                    path: 'price' } },
            _message: 'Transaction validation failed',
            message:
            'Transaction validation failed: price: Path `price` is required.',
            name: 'ValidationError' }

        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Potato",
                date: dateToUse,
                //price: "5.90",
                category: "Food",
                transactionType: "expense",
                monthYearId: mmyyidToUse
            })
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.deep.equal(errorMessage);
                done()
            })
    });

    it("shouldn't accept a incorrect category", function(done){
        var errorMessage = { errors:
            { category:
                { message: 'Validator failed for path `category` with value `Rent`',
                    name: 'ValidatorError',
                    properties: {
                    message: "Validator failed for path `category` with value `Rent`",
                    path: "category",
                    type: "user defined",
                    value: "Rent",
                    },
                    kind: 'user defined',
                    path: 'category',
                    value: 'Rent' } },
            _message: 'Transaction validation failed',
            message:
            'Transaction validation failed: category: Validator failed for path `category` with value `Rent`',
            name: 'ValidationError' }

        chai.request(app)
            .post(`/api/transaction?userId=${testToken}`)
            .send({
                item: "Apartment",
                date: dateToUse,
                price: "679.75",
                category: "Rent",
                transactionType: "expense",
                monthYearId: mmyyidToUse
            })
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.deep.equal(errorMessage);
                done()
            });    
    })

    it('should have 3 transactions for testUser with date=mmyyidtouse', function(done){
        chai.request(app)
            .get(`/api/transactions?userId=${testToken}&dates=${mmyyidToUse}`)
            // .send({userId: testToken})
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(3);
                transaction = res.body[1];
                delTransaction = res.body[2];
                done();
            })
    });
});

describe("PUT", function() {
    it('should update transaction with field changes', function (done){
        totalsAll -= (transaction.price * 100)
        foodTotal -= (transaction.price * 100)
        transaction.item = "Anniversary Dinner";
        transaction.price = "76.32";
        chai.request(app)
            .put('/api/transaction')
            .send(transaction)
            .end((err, res) => {
                totalsAll += (parseFloat(res.body.price) * 100);
                foodTotal += (parseFloat(res.body.price) * 100);
                expect(res.statusCode).to.equal(200);
                expect(res.body).excluding('updatedAt').to.deep.equal(transaction);
                done();
            })
    });

    it("should fail if category doesn't exist", function (done){
        transaction2 = JSON.parse(JSON.stringify(transaction))
        transaction2.item = "Anniversary Dinner";
        transaction2.price = 76.32;
        transaction2.category = 'Rent';
        chai.request(app)
            .put('/api/transaction')
            .send(transaction2)
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                //expect(res.body).excluding('updatedAt').to.deep.equal(transaction);
                done();
            })
    });

    it("should fail if _id doesn't exist", function (done){
        transaction3 = JSON.parse(JSON.stringify(transaction))
        transaction3.item = "Anniversary Dinner";
        transaction3.price = 76.32;
        transaction3._id = '1234';
        chai.request(app)
            .put('/api/transaction')
            .send(transaction3)
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                //expect(res.body).excluding('updatedAt').to.deep.equal(transaction);
                done();
            })
    });
});

describe("DELETE", function() {
    it("should delete a transaction successfully", function (done){
        chai.request(app)
            .delete(`/api/transaction/${delTransaction._id}`)
            .end((err, res) => {
                socialTotal -= (parseFloat(res.body.price) * 100);
                totalsAll -= (parseFloat(res.body.price) * 100);
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.deep.equal(delTransaction);
                done();
            })
    });

    it('should have 2 transactions for testUser with date=mmyyidtouse', function(done){
        chai.request(app)
            .get(`/api/transactions?userId=${testToken}&dates=${mmyyidToUse}`)
            // .send({userId: testToken})
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(2);
                done();
            })
    });

    it("should fail if transaction doesn't exist", function (done){
        chai.request(app)
            .delete(`/api/transaction/${delTransaction._id}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.equal("Transaction Not Found");
                done();
            })
    });
});

describe("getTotalsAll", function() {
    var lastmonthIncome = 0;
    var lastmonthTranspoTotal = 0;
    it("should return category totals of all transactions", function(done){
        chai.request(app)
            .get(`/api/transaction/totals/${testToken}/all`)
            .end((err, res) => {
                for(var i in res.body){
                    if (res.body[i]._id === 'Transportation'){
                        expect(res.body[i].totals).to.equal(transpoTotal);
                    } else if (res.body[i]._id === 'Income'){
                        expect(res.body[i].totals).to.equal(incomeAll);
                    } else if (res.body[i]._id === 'Food'){
                        expect(res.body[i].totals).to.equal(foodTotal);
                    } else{
                        expect.fail("should not get here");
                    }
                }
                done();
            });
    });

    it("should get last month's transactions", function(done) {
        lastmonthId = dateformat(moment(dateToUse).subtract(1, 'month'), 'mmyy');
        chai.request(app)
            .get(`/api/transactions?userId=${testToken}&dates=${lastmonthId}`)
            .end((err, res) => {
                expect(res.body).to.have.length(2);
                expect(res.body).to.be.an('array');
                lastmonthIncome = (parseFloat(res.body[0].price) * 100)
                lastmonthTranspoTotal = (parseFloat(res.body[1].price) * 100)
                done();
            })
    })

    it("should return category total of last months transactions", function(done){
        lastmonthId = dateformat(moment(dateToUse).subtract(1, 'month'), 'mmyy');
        chai.request(app)
            .get(`/api/transaction/totals/${testToken}/${lastmonthId}`)
            .end((err, res) => {
                for(var i in res.body){
                    if (res.body[i]._id === 'Transportation'){
                        expect(res.body[i].totals).to.equal(lastmonthTranspoTotal);
                    } else if (res.body[i]._id === 'Income'){
                        expect(res.body[i].totals).to.equal(lastmonthIncome);
                    } else{
                        //("should not get here");
                    }
                }
                done();
            })
    })
});

describe("getSpendingTotal", function() {
    it("should return total of all transactions with date in param", function(done){
    chai.request(app)
        .get(`/api/transaction/spendingTotal/${testToken}/all`)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]._id).to.equal(testToken);
            expect(res.body[0].spendingTotal).to.equal(totalsAll);
            done();
        })
    });

    it("should return total of all transactions with mmyyId one month before current date", function(done){
        lastmonthId = dateformat(moment(dateToUse).subtract(1, 'month'), 'mmyy');
        chai.request(app)
            .get(`/api/transaction/spendingTotal/${testToken}/${lastmonthId}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.be.an('object');
                expect(res.body[0]._id).to.equal(testToken);
                expect(res.body[0].spendingTotal).to.equal(lastMonthTotal);
                done();
            })
        });
})

describe("getIncomeTotal", function() {
    it("should return total of all incomes with all date in param", function(done){
    chai.request(app)
        .get(`/api/transaction/incomeTotal/${testToken}/all`)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]._id).to.equal(testToken);
            expect(res.body[0].incomeTotal).to.equal(incomeAll);
            done();
        })
    });

    it("should return total of all transactions with mmyyId one month before current date", function(done){
        lastmonthId = dateformat(moment(dateToUse).subtract(1, 'month'), 'mmyy');
        chai.request(app)
            .get(`/api/transaction/incomeTotal/${testToken}/${lastmonthId}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.be.an('object');
                expect(res.body[0]._id).to.equal(testToken);
                expect(res.body[0].incomeTotal).to.equal(lastMonthIncomeTotal);
                done();
            })
        });
})


    // after(function (done) {
    //     //appServer.close(done);
    // });
// });
// it("Should return an error", async function(done) {
        //     fetchMock
        //         .mock({
        //             name: 'route',
        //             matcher: `/api/transactions?userId=${testToken}`,
        //             method: 'GET',
        //             credentials: 'same-origin',
        //             response: {
        //                 status: 300,
        //                 body: []
        //             }
        //         });
        

        //     //fetchMock.mock('http://example.com', 200);
        //     const res = await fetch(`/api/transaction?userId=` + testToken,);
        //     console.log(res);
        //     assert(res.staus);
        //     fetchMock.restore();


        //     //nock.disableNetConnect()
        //     // Allow localhost connections so we can test local routes and mock servers.
        //     nock.recorder.rec()
        //     // nock('http://localhost:3001', {"encodedQueryParams":true})
        //     //     .get('/api/transactions')
        //     //     .query({"userId":"104672091098309862322"})
        //     //     .reply(300, {
        //     //         "status": 200,
        //     //         "message": "This is a mocked response"
        //     // });
        //     // // nock.recorder.clear()
        //     // nock.recorder.rec({
        //     //     dont_print: true,
        //     //   })
        //       chai.request(app)
        //         .get(`/api/transactions?userId=${testToken}`)
        //         .end((err, res) => {
        //             console.log(res);
        //             expect(res.statusCode).to.equal(500);
        //             // expect(res.body).to.be.an('array');
        //             // expect(res.body).to.be.of.length(2);
        //             done();
        //         })
        //     // const nockCalls = nock.recorder.play()
        //     // console.log(nockCalls);
        //     // done();
        //     // return request
            

            

        //     // const result = await chai.request(app).get(`/api/transactions?userId=${testToken}`);
        //     // expect(result.status).to.equal(200);
        //     // expect(result.body).to.deep.equal({ data : 'some data'});
        //     // done();
                
        //         // //perform the request to the api which will now be intercepted by nock
        //         // chai.request(app)
        //         // .get(`/api/transactions?userId=${testToken}`)
        //         // .end(function (err, res) {
        //         //     console.log(res);
        //         //     //assert that the mocked response is returned
        //         //     expect(res.body.status).to.equal(200);
        //         //     expect(res.body.message).to.equal("This is a mocked response");
        //         //     done();
        //         // });


        //     // const requestNock = nock('http://localhost:3001')
        //     //     .get(`/api/transactions?userId=${testToken}`)
        //     //     .reply(500);
            
        //     // return chai.request(app)
        //     //         .get(`/api/transactions?userId=${testToken}`)
        //     //         .end((err, res) => {
        //     //             expect(requestNock).to.have.been.requested;
        //     //             expect(res.statusCode).to.equal(500);
        //     //             //console.log(res);
        //     //             //done();
        //     //         });
        // });
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
