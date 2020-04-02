const common = require("../common");
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
const faker = common.faker;
const dateformat = common.dateformat;

const Transaction = common.Transaction;
const testUserId = common.options.testUserId;
const anotherObjectId = common.options.anotherObjectId;

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
    it('should return no transactions for a test user: date=mmyy', function(done){
        let date = dateformat(faker.date.between('2020-01-01', '2020-04-02'), 'mmyy');
        chai.request(app)
            .get(`/api/transactions?userId=${testUserId}&dates=${date}`)
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
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: mmyyDate
            }
            chai.request(app)
                .post(`/api/transaction?userId=${testUserId}`)
                .send(postedItem)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.userId).to.equal(testUserId);
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
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: mmyyDate
            }
            chai.request(app)
                .post(`/api/transaction?userId=${testUserId}`)
                .send(postedItem)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.userId).to.equal(testUserId);
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
                    price: faker.finance.amount(),
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
                    price: faker.finance.amount(),
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
                    price: faker.finance.amount(),
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
                    price: faker.finance.amount(),
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
                price: faker.finance.amount(),
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

describe("PUT", function() {
    it('should update transaction with field changes', function (done){
        let transaction = new Transaction({
            userId: testUserId,
            item: faker.commerce.product(),
            date: date,
            price: faker.finance.amount(),
            category: "Misc.", 
            transactionType: "expense", 
            monthYearId: mmyyDate
        });
        transaction.save( function(err, trans) {
            transUpdate = JSON.parse(JSON.stringify(trans));
            transUpdate.item = "Updated Item";
            transUpdate.price = "12.34";
            chai.request(app)
                .put(`/api/transaction`)
                .send(transUpdate)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).excluding('updatedAt').to.deep.equal(transUpdate);
                    done();
                })
            })
    });
    it('should fail if category does not exist', function (done){
        let transaction = new Transaction({
            userId: testUserId,
            item: faker.commerce.product(),
            date: date,
            price: faker.finance.amount(),
            category: "Misc.", 
            transactionType: "expense", 
            monthYearId: mmyyDate
        });
        transaction.save( function(err, trans) {
            transUpdate = JSON.parse(JSON.stringify(trans));
            transUpdate.item = "Updated Item";
            transUpdate.price = "12.34";
            transUpdate.category = 'RandomVal';
            chai.request(app)
                .put(`/api/transaction`)
                .send(transUpdate)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(500);
                    expect(res.body.message).to.equal("Transaction validation failed: category: Validator failed for path `category` with value `RandomVal`");
                    done();
                })
            })
    });
    it('should fail if _id does not exist', function (done){
        let transaction = new Transaction({
            userId: testUserId,
            item: faker.commerce.product(),
            date: date,
            price: faker.finance.amount(),
            category: "Misc.", 
            transactionType: "expense", 
            monthYearId: mmyyDate
        });
        transaction.save( function(err, trans) {
            transUpdate = JSON.parse(JSON.stringify(trans));
            transUpdate.item = "Updated Item";
            transUpdate._id = '1234';
            transUpdate.price = "12.34";
            chai.request(app)
                .put(`/api/transaction`)
                .send(transUpdate)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(500);
                    expect(res.body.message).to.equal('Cast to ObjectId failed for value "1234" at path "_id" for model "Transaction"');
                    done();
                })
            })
    });
});

describe("DELETE", function() {
    it("should delete a transaction successfully", function (done){
        let transaction = new Transaction({
            userId: testUserId,
            item: faker.commerce.product(),
            date: date,
            price: faker.finance.amount(),
            category: "Misc.", 
            transactionType: "expense", 
            monthYearId: mmyyDate
        });
        transaction.save( function(err, trans) {
            delTransaction = JSON.parse(JSON.stringify(trans));
            chai.request(app)
                .delete(`/api/transaction/${delTransaction._id}`)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.deep.equal(delTransaction);
                    done();
                });
            });
    });
    it("should return 400 if transaction doesn't exist", function (done){
        delTransaction = {
            notAReal: 'transaction',
            _id: anotherObjectId
        }
        chai.request(app)
            .delete(`/api/transaction/${delTransaction._id}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.equal("Transaction Not Found");
                done();
            });
    });
})

describe("getTotalsAll", function() {
    it("should return category totals of all transactions", function(done){
        let date1 = faker.date.recent(90);
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.recent(20);
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.recent(10);
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date1,
                price: faker.finance.amount(),
                category: "Transportation", 
                transactionType: "expense", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date2,
                price: faker.finance.amount(),
                category: "Food", 
                transactionType: "expense", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date3,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date3MMYY
            }
        ]
        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/totals/${testUserId}/all`)
                .end((err, res) => {
                    for(var i in res.body){
                        res.body[i].totals = (res.body[i].totals/100).toFixed(2);
                        if (res.body[i]._id === 'Transportation'){
                            expect(res.body[i].totals).to.equal(transactions[0].price);
                        } else if (res.body[i]._id === 'Food'){
                            expect(res.body[i].totals).to.equal(transactions[1].price);
                        } else if (res.body[i]._id === 'Misc.'){
                            expect(res.body[i].totals).to.equal(transactions[2].price);
                        } else{
                            expect.fail("should not get here");
                        }
                    }
                    done();
                });
            });
    });
    it("should return category totals of a specific month only", function(done){
        let date1 = faker.date.between('2020-02-01', '2020-02-29');
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.between('2020-02-01', '2020-02-29');
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.between('2020-03-01', '2020-04-01');
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date1,
                price: faker.finance.amount(),
                category: "Transportation", 
                transactionType: "expense", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date2,
                price: faker.finance.amount(),
                category: "Food", 
                transactionType: "expense", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date3,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date3MMYY
            }
        ]
        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/totals/${testUserId}/${date1MMYY}`)
                .end((err, res) => {
                    for(var i in res.body){
                        res.body[i].totals = (res.body[i].totals/100).toFixed(2);
                        if (res.body[i]._id === 'Transportation'){
                            expect(res.body[i].totals).to.equal(transactions[0].price);
                        } else if (res.body[i]._id === 'Food'){
                            expect(res.body[i].totals).to.equal(transactions[1].price);
                        } else if (res.body[i]._id === 'Misc.'){
                            expect.fail("should not get here");
                        } else{
                            expect.fail("should not get here");
                        }
                    }
                    done();
                });
        });
    });
});

describe("getSpendingTotal", function() {
    it("should return spending total of all transactions", function(done){
        let date1 = faker.date.between('2020-02-01', '2020-02-29');
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.between('2020-02-01', '2020-02-29');
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.between('2020-03-01', '2020-04-01');
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date1,
                price: faker.finance.amount(),
                category: "Transportation", 
                transactionType: "expense", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date2,
                price: faker.finance.amount(),
                category: "Food", 
                transactionType: "expense", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date3,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date3MMYY
            }
        ]

        let totalsAll = (parseFloat(transactions[0].price) + parseFloat(transactions[1].price)).toFixed(2);        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/spendingTotal/${testUserId}/${date1MMYY}`)
                .end((err, res) => {
                    res.body[0].spendingTotal = (res.body[0].spendingTotal/100).toFixed(2);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]._id).to.equal(testUserId);
                    expect(res.body[0].spendingTotal).to.equal(totalsAll);
                    done();
                });
            });
    });

    it("should return total of a specific month only", function(done){
        let date1 = faker.date.recent(90);
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.recent(20);
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.recent(10);
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date1,
                price: faker.finance.amount(),
                category: "Transportation", 
                transactionType: "expense", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date2,
                price: faker.finance.amount(),
                category: "Food", 
                transactionType: "expense", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date3,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date3MMYY
            }
        ]

        let totalsAll = (parseFloat(transactions[0].price) + parseFloat(transactions[1].price) + parseFloat(transactions[2].price)).toFixed(2);        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/spendingTotal/${testUserId}/all`)
                .end((err, res) => {
                    res.body[0].spendingTotal = (res.body[0].spendingTotal/100).toFixed(2);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]._id).to.equal(testUserId);
                    expect(res.body[0].spendingTotal).to.equal(totalsAll);
                    done();
                });
            });
    });
});

describe("getIncomeTotal", function() {
    it("should return income total of all transactions", function(done){
        let date1 = faker.date.between('2020-02-01', '2020-02-29');
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.between('2020-02-01', '2020-02-29');
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.between('2020-03-01', '2020-04-01');
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date2,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date3,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date3MMYY
            }
        ]

        let totalsAll = (parseFloat(transactions[0].price) + parseFloat(transactions[1].price) + parseFloat(transactions[2].price)).toFixed(2);        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/incomeTotal/${testUserId}/all`)
                .end((err, res) => {
                    res.body[0].incomeTotal = ((res.body[0].incomeTotal)/100).toFixed(2);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]._id).to.equal(testUserId);
                    expect(res.body[0].incomeTotal).to.equal(totalsAll);
                    done();
                });
        });
    });
    it("should return income total of all transactions for a specific month", function(done){
        let date1 = faker.date.between('2020-02-01', '2020-02-29');
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.between('2020-02-01', '2020-02-29');
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.between('2020-03-01', '2020-04-01');
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date2,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date3,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date3MMYY
            }
        ]

        let totalsAll = (parseFloat(transactions[0].price) + parseFloat(transactions[1].price)).toFixed(2);        
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/incomeTotal/${testUserId}/${date1MMYY}`)
                .end((err, res) => {
                    res.body[0].incomeTotal = ((res.body[0].incomeTotal)/100).toFixed(2);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]._id).to.equal(testUserId);
                    expect(res.body[0].incomeTotal).to.equal(totalsAll);
                    done();
                });
        });
    });
});
describe("earliestTransaction", function() {
    it("should return the earliest Transaction", function(done){
        let date1 = faker.date.between('2020-01-01', '2020-01-31');
        let date1MMYY = dateformat(date1, 'mmyy')
        let date2 = faker.date.between('2020-02-01', '2020-02-29');
        let date2MMYY = dateformat(date2, 'mmyy')
        let date3 = faker.date.between('2020-03-01', '2020-04-01');
        let date3MMYY = dateformat(date3, 'mmyy')
        let transactions = [
            {
                userId: testUserId,
                item: faker.name.jobTitle(),
                date: date1,
                price: faker.finance.amount(),
                category: "Income", 
                transactionType: "income", 
                monthYearId: date1MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date2,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date2MMYY
            }, 
            {
                userId: testUserId,
                item: faker.commerce.product(),
                date: date3,
                price: faker.finance.amount(),
                category: "Misc.", 
                transactionType: "expense", 
                monthYearId: date3MMYY
            }
        ]
        Transaction.insertMany(transactions)
        .then(() => {
            chai.request(app)
                .get(`/api/transaction/earliest/${testUserId}/`)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0].userId).to.equal(testUserId);
                    expect(res.body[0]).excluding(['date', 'id', "_id", '__v', 'createdAt', 'updatedAt']).to.deep.equal(transactions[0]);
                    done();
                });
        });
    });
});