const common = require("../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;
const dateformat = common.dateformat;

const Transaction = common.Transaction;
const testUserId = common.options.testUserId;

beforeEach(function (done) {
    assert.isFulfilled(Transaction.deleteMany({}), Error).notify(done);
});

describe("GET", function() {
    it('should return no transactions for a test user: date="all"', function(done){
        chai.request(app)
            .get(`/api/transactions?userId=${testUserId}&dates=all`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(0);
                done();
            });
    });

    it('should return no transactions for a test user: date=undefined', function(done){
        chai.request(app)
            .get(`/api/transactions?userId=${testUserId}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(0);
                done();
            });
    });
});

describe("POST", function() {
    describe('Good POSTS', function() {
        it('should post an expense transaction', function(done) {
            date = faker.date.recent(90);
            mmyyDate = dateformat(date, 'mmyy');
            postedItem = {
                item: faker.commerce.product(),
                date: date,
                price: faker.commerce.price(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: mmyyDate
            }
            chai.request(app)
                .post(`/api/transaction?userId=${testUserId}`)
                .send(postedItem)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.userId).to.equal(testUserId.toHexString());
                    expect(res.body.item).to.equal(postedItem.item);
                    expect(res.body.price).to.equal(postedItem.price);
                    expect(res.body.category).to.equal(postedItem.category);
                    expect(res.body.transactionType).to.equal(postedItem.transactionType);
                    expect(res.body.monthYearId).to.equal(postedItem.monthYearId);
                    done();
                });
        });
    
        it('should post an income transaction', function(done) {
            date = faker.date.recent(90);
            mmyyDate = dateformat(date, 'mmyy');
            postedItem = {
                item: faker.name.jobTitle(),
                date: date,
                price: faker.finance.amount(50, 100, 2),
                category: "Income", 
                transactionType: "income", 
                monthYearId: mmyyDate
            }
            chai.request(app)
                .post(`/api/transaction?userId=${testUserId}`)
                .send(postedItem)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.userId).to.equal(testUserId.toHexString());
                    expect(res.body.item).to.equal(postedItem.item);
                    expect(res.body.price).to.equal(postedItem.price);
                    expect(res.body.category).to.equal(postedItem.category);
                    expect(res.body.transactionType).to.equal(postedItem.transactionType);
                    expect(res.body.monthYearId).to.equal(postedItem.monthYearId);
                    done();
                });
        });
    })

    describe('Bad POSTS', function() {
        describe('Missing fields', function() {
            it('should not post if missing item', function (done) {
                date = faker.date.recent(90);
                mmyyDate = dateformat(date, 'mmyy');
                badPostItem = {
                    date: date,
                    price: faker.commerce.price(),
                    category: "Misc.", 
                    transactionType: "expense", 
                    monthYearId: mmyyDate
                }
                chai.request(app)
                    .post(`/api/transaction?userId=${testUserId}`)
                    .send(badPostItem)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body).to.be.an('object');
                        expect(res.body.message).to.equal('Transaction validation failed: item: Path `item` is required.')
                        done();
                    });
            });
    
            it('should not post if missing price', function (done) {
                date = faker.date.recent(90);
                mmyyDate = dateformat(date, 'mmyy');
                badPostItem = {
                    item: faker.commerce.product(),
                    date: date,
                    category: "Misc.", 
                    transactionType: "expense", 
                    monthYearId: mmyyDate
                }
                chai.request(app)
                    .post(`/api/transaction?userId=${testUserId}`)
                    .send(badPostItem)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body).to.be.an('object');
                        expect(res.body.message).to.equal('Transaction validation failed: price: Path `price` is required.')
                        done();
                    });
            });
            it('should not post if missing category', function (done) {
                date = faker.date.recent(90);
                mmyyDate = dateformat(date, 'mmyy');
                badPostItem = {
                    item: faker.commerce.product(),
                    date: date,
                    price: faker.commerce.price(),
                    transactionType: "expense", 
                    monthYearId: mmyyDate
                }
                chai.request(app)
                    .post(`/api/transaction?userId=${testUserId}`)
                    .send(badPostItem)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body).to.be.an('object');
                        expect(res.body.message).to.equal('Transaction validation failed: category: Path `category` is required.')
                        done();
                    });
            });
            it('should not post if missing transactionType', function (done) {
                date = faker.date.recent(90);
                mmyyDate = dateformat(date, 'mmyy');
                badPostItem = {
                    item: faker.commerce.product(),
                    date: date,
                    price: faker.commerce.price(),
                    category: "Misc.", 
                    monthYearId: mmyyDate
                }
                chai.request(app)
                    .post(`/api/transaction?userId=${testUserId}`)
                    .send(badPostItem)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body).to.be.an('object');
                        expect(res.body.message).to.equal('Transaction validation failed: transactionType: Path `transactionType` is required.')
                        done();
                    });
            });
            it('should not post if missing monthYearId', function (done) {
                date = faker.date.recent(90);
                mmyyDate = dateformat(date, 'mmyy');
                badPostItem = {
                    item: faker.commerce.product(),
                    date: date,
                    price: faker.commerce.price(),
                    category: "Misc.", 
                    transactionType: "expense", 
                }
                chai.request(app)
                    .post(`/api/transaction?userId=${testUserId}`)
                    .send(badPostItem)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body).to.be.an('object');
                        expect(res.body.message).to.equal('Transaction validation failed: monthYearId: Path `monthYearId` is required.')
                        done();
                    });
            });
        });
        it ("should not accept a incorrect category", function(done){
            date = faker.date.recent(90);
            mmyyDate = dateformat(date, 'mmyy');
            badPostItem = {
                item: faker.commerce.product(),
                date: date,
                price: faker.commerce.price(),
                category: "RandomVal", 
                transactionType: "expense", 
                monthYearId: mmyyDate
            }
            chai.request(app)
            .post(`/api/transaction?userId=${testUserId}`)
            .send(badPostItem)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.statusCode).to.equal(500);
                expect(res.body.message).to.equal('Transaction validation failed: category: Validator failed for path `category` with value `RandomVal`');
                done()
            });
        })
    });

})
