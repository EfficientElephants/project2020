/* eslint-disable no-underscore-dangle */
const common = require('../common');

const { assert, expect, chai, app, faker, dateformat, Transaction } = common;
const { testUserId, anotherObjectId } = common.options;

beforeEach((done) => {
  assert.isFulfilled(Transaction.deleteMany({}), Error).notify(done);
});

describe('GET', () => {
  it('should return no transactions for a test user: date="all"', (done) => {
    chai.request(app)
      .get(`/api/transactions?userId=${testUserId}&dates=all`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.of.length(0);
        done();
      });
  });

  it('should return no transactions for a test user: date=undefined', (done) => {
    chai.request(app)
      .get(`/api/transactions?userId=${testUserId}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.of.length(0);
        done();
      });
  });
  it('should return no transactions for a test user: date=mmyy', (done) => {
    const date = dateformat(faker.date.between('2020-01-01', '2020-04-02'), 'mmyy');
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

describe('POST', () => {
  describe('Good POSTS', () => {
    it('should post an expense transaction', (done) => {
      const date = faker.date.recent(90);
      const mmyyDate = dateformat(date, 'mmyy');
      const postedItem = {
        item: faker.commerce.product(),
        date,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: mmyyDate
      };
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

    it('should post an income transaction', (done) => {
      const date = faker.date.recent(90);
      const mmyyDate = dateformat(date, 'mmyy');
      const postedItem = {
        item: faker.name.jobTitle(),
        date,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: mmyyDate
      };
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
  });

  describe('Bad POSTS', () => {
    describe('Missing fields', () => {
      it('should not post if missing item', (done) => {
        const date = faker.date.recent(90);
        const mmyyDate = dateformat(date, 'mmyy');
        const badPostItem = {
          date,
          price: faker.finance.amount(),
          category: 'Misc.',
          transactionType: 'expense',
          monthYearId: mmyyDate
        };
        chai.request(app)
          .post(`/api/transaction?userId=${testUserId}`)
          .send(badPostItem)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Transaction validation failed: item: Path `item` is required.');
            done();
          });
      });

      it('should not post if missing price', (done) => {
        const date = faker.date.recent(90);
        const mmyyDate = dateformat(date, 'mmyy');
        const badPostItem = {
          item: faker.commerce.product(),
          date,
          category: 'Misc.',
          transactionType: 'expense',
          monthYearId: mmyyDate
        };
        chai.request(app)
          .post(`/api/transaction?userId=${testUserId}`)
          .send(badPostItem)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Transaction validation failed: price: Path `price` is required.');
            done();
          });
      });
      it('should not post if missing category', (done) => {
        const date = faker.date.recent(90);
        const mmyyDate = dateformat(date, 'mmyy');
        const badPostItem = {
          item: faker.commerce.product(),
          date,
          price: faker.finance.amount(),
          transactionType: 'expense',
          monthYearId: mmyyDate
        };
        chai.request(app)
          .post(`/api/transaction?userId=${testUserId}`)
          .send(badPostItem)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Transaction validation failed: category: Path `category` is required.');
            done();
          });
      });
      it('should not post if missing transactionType', (done) => {
        const date = faker.date.recent(90);
        const mmyyDate = dateformat(date, 'mmyy');
        const badPostItem = {
          item: faker.commerce.product(),
          date,
          price: faker.finance.amount(),
          category: 'Misc.',
          monthYearId: mmyyDate
        };
        chai.request(app)
          .post(`/api/transaction?userId=${testUserId}`)
          .send(badPostItem)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Transaction validation failed: transactionType: Path `transactionType` is required.');
            done();
          });
      });
      it('should not post if missing monthYearId', (done) => {
        const date = faker.date.recent(90);
        const badPostItem = {
          item: faker.commerce.product(),
          date,
          price: faker.finance.amount(),
          category: 'Misc.',
          transactionType: 'expense',
        };
        chai.request(app)
          .post(`/api/transaction?userId=${testUserId}`)
          .send(badPostItem)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Transaction validation failed: monthYearId: Path `monthYearId` is required.');
            done();
          });
      });
    });
    it('should not accept a incorrect category', (done) => {
      const date = faker.date.recent(90);
      const mmyyDate = dateformat(date, 'mmyy');
      const badPostItem = {
        item: faker.commerce.product(),
        date,
        price: faker.finance.amount(),
        category: 'RandomVal',
        transactionType: 'expense',
        monthYearId: mmyyDate
      };
      chai.request(app)
        .post(`/api/transaction?userId=${testUserId}`)
        .send(badPostItem)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Transaction validation failed: category: Validator failed for path `category` with value `RandomVal`');
          done();
        });
    });
  });
});

describe('PUT', () => {
  it('should update transaction with field changes', (done) => {
    const date = faker.date.recent(90);
    const mmyyDate = dateformat(date, 'mmyy');
    const transaction = new Transaction({
      userId: testUserId,
      item: faker.commerce.product(),
      date,
      price: faker.finance.amount(),
      category: 'Misc.',
      transactionType: 'expense',
      monthYearId: mmyyDate
    });
    transaction.save((err, trans) => {
      const transUpdate = JSON.parse(JSON.stringify(trans));
      transUpdate.item = 'Updated Item';
      transUpdate.price = '12.34';
      chai.request(app)
        .put('/api/transaction')
        .send(transUpdate)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).excluding('updatedAt').to.deep.equal(transUpdate);
          done();
        });
    });
  });
  it('should fail if category does not exist', (done) => {
    const date = faker.date.recent(90);
    const mmyyDate = dateformat(date, 'mmyy');
    const transaction = new Transaction({
      userId: testUserId,
      item: faker.commerce.product(),
      date,
      price: faker.finance.amount(),
      category: 'Misc.',
      transactionType: 'expense',
      monthYearId: mmyyDate
    });
    transaction.save((err, trans) => {
      const transUpdate = JSON.parse(JSON.stringify(trans));
      transUpdate.item = 'Updated Item';
      transUpdate.price = '12.34';
      transUpdate.category = 'RandomVal';
      chai.request(app)
        .put('/api/transaction')
        .send(transUpdate)
        .end((error, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Transaction validation failed: category: Validator failed for path `category` with value `RandomVal`');
          done();
        });
    });
  });
  it('should fail if _id does not exist', (done) => {
    const date = faker.date.recent(90);
    const mmyyDate = dateformat(date, 'mmyy');
    const transaction = new Transaction({
      userId: testUserId,
      item: faker.commerce.product(),
      date,
      price: faker.finance.amount(),
      category: 'Misc.',
      transactionType: 'expense',
      monthYearId: mmyyDate
    });
    transaction.save((err, trans) => {
      const transUpdate = JSON.parse(JSON.stringify(trans));
      transUpdate.item = 'Updated Item';
      transUpdate._id = '1234';
      transUpdate.price = '12.34';
      chai.request(app)
        .put('/api/transaction')
        .send(transUpdate)
        .end((error, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Cast to ObjectId failed for value "1234" at path "_id" for model "Transaction"');
          done();
        });
    });
  });
});

describe('DELETE', () => {
  it('should delete a transaction successfully', (done) => {
    const date = faker.date.recent(90);
    const mmyyDate = dateformat(date, 'mmyy');
    const transaction = new Transaction({
      userId: testUserId,
      item: faker.commerce.product(),
      date,
      price: faker.finance.amount(),
      category: 'Misc.',
      transactionType: 'expense',
      monthYearId: mmyyDate
    });
    transaction.save((err, trans) => {
      const delTransaction = JSON.parse(JSON.stringify(trans));
      chai.request(app)
        .delete(`/api/transaction/${delTransaction._id}`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal(delTransaction);
          done();
        });
    });
  });
  it("should return 400 if transaction doesn't exist", (done) => {
    const delTransaction = {
      notAReal: 'transaction',
      _id: anotherObjectId
    };
    chai.request(app)
      .delete(`/api/transaction/${delTransaction._id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.text).to.equal('Transaction Not Found');
        done();
      });
  });
});

describe('getTotalsAll', () => {
  it('should return category totals of all transactions', (done) => {
    const date1 = faker.date.recent(90);
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.recent(20);
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.recent(10);
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Transportation',
        transactionType: 'expense',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Food',
        transactionType: 'expense',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date3MMYY
      }
    ];

    Transaction.insertMany(transactions).then(() => {
      chai
        .request(app)
        .get(`/api/transaction/totals/${testUserId}/all`)
        .end((err, res) => {
          res.body.forEach((resitem) => {
            const item = resitem;
            item.totals = (item.totals / 100).toFixed(2);
            if (item._id === 'Transportation') {
              expect(item.totals).to.equal(transactions[0].price);
            } else if (item._id === 'Food') {
              expect(item.totals).to.equal(transactions[1].price);
            } else if (item._id === 'Misc.') {
              expect(item.totals).to.equal(transactions[2].price);
            } else {
              expect.fail('should not get here');
            }
          });
          done();
        });
    });
  });
  it('should return category totals of a specific month only', (done) => {
    const date1 = faker.date.between('2020-02-01', '2020-02-29');
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.between('2020-02-01', '2020-02-29');
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.between('2020-03-01', '2020-04-01');
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Transportation',
        transactionType: 'expense',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Food',
        transactionType: 'expense',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date3MMYY
      }
    ];

    Transaction.insertMany(transactions).then(() => {
      chai
        .request(app)
        .get(`/api/transaction/totals/${testUserId}/${date1MMYY}`)
        .end((err, res) => {
          res.body.forEach((resitem) => {
            const item = resitem;
            item.totals = (item.totals / 100).toFixed(2);
            if (item._id === 'Transportation') {
              expect(item.totals).to.equal(transactions[0].price);
            } else if (item._id === 'Food') {
              expect(item.totals).to.equal(transactions[1].price);
            } else if (item._id === 'Misc.') {
              expect.fail('should not get here');
            } else {
              expect.fail('should not get here');
            }
          });
          done();
        });
    });
  });
});

describe('getSpendingTotal', () => {
  it('should return spending total of all transactions', (done) => {
    const date1 = faker.date.between('2020-02-01', '2020-02-29');
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.between('2020-02-01', '2020-02-29');
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.between('2020-03-01', '2020-04-01');
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Transportation',
        transactionType: 'expense',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Food',
        transactionType: 'expense',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date3MMYY
      }
    ];

    const totalsAll =
      (parseFloat(transactions[0].price) + parseFloat(transactions[1].price)).toFixed(2);
    Transaction.insertMany(transactions)
      .then(() => {
        chai.request(app)
          .get(`/api/transaction/spendingTotal/${testUserId}/${date1MMYY}`)
          .end((err, res) => {
            res.body[0].spendingTotal = (res.body[0].spendingTotal / 100).toFixed(2);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]._id).to.equal(testUserId);
            expect(res.body[0].spendingTotal).to.equal(totalsAll);
            done();
          });
      });
  });

  it('should return total of a specific month only', (done) => {
    const date1 = faker.date.recent(90);
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.recent(20);
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.recent(10);
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Transportation',
        transactionType: 'expense',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Food',
        transactionType: 'expense',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date3MMYY
      }
    ];

    const totalsAll =
      (parseFloat(transactions[0].price) +
      parseFloat(transactions[1].price) +
      parseFloat(transactions[2].price)).toFixed(2);
    Transaction.insertMany(transactions)
      .then(() => {
        chai.request(app)
          .get(`/api/transaction/spendingTotal/${testUserId}/all`)
          .end((err, res) => {
            res.body[0].spendingTotal = (res.body[0].spendingTotal / 100).toFixed(2);
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

describe('getIncomeTotal', () => {
  it('should return income total of all transactions', (done) => {
    const date1 = faker.date.between('2020-02-01', '2020-02-29');
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.between('2020-02-01', '2020-02-29');
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.between('2020-03-01', '2020-04-01');
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date3MMYY
      }
    ];

    const totalsAll =
      (parseFloat(transactions[0].price) +
       parseFloat(transactions[1].price) +
        parseFloat(transactions[2].price)).toFixed(2);
    Transaction.insertMany(transactions)
      .then(() => {
        chai.request(app)
          .get(`/api/transaction/incomeTotal/${testUserId}/all`)
          .end((err, res) => {
            res.body[0].incomeTotal = ((res.body[0].incomeTotal) / 100).toFixed(2);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0]._id).to.equal(testUserId);
            expect(res.body[0].incomeTotal).to.equal(totalsAll);
            done();
          });
      });
  });
  it('should return income total of all transactions for a specific month', (done) => {
    const date1 = faker.date.between('2020-02-01', '2020-02-29');
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.between('2020-02-01', '2020-02-29');
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.between('2020-03-01', '2020-04-01');
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date3MMYY
      }
    ];

    const totalsAll =
    (parseFloat(transactions[0].price) + parseFloat(transactions[1].price)).toFixed(2);
    Transaction.insertMany(transactions)
      .then(() => {
        chai.request(app)
          .get(`/api/transaction/incomeTotal/${testUserId}/${date1MMYY}`)
          .end((err, res) => {
            res.body[0].incomeTotal = ((res.body[0].incomeTotal) / 100).toFixed(2);
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
describe('earliestTransaction', () => {
  it('should return the earliest Transaction', (done) => {
    const date1 = faker.date.between('2020-01-01', '2020-01-31');
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.between('2020-02-01', '2020-02-29');
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.between('2020-03-01', '2020-04-01');
    const date3MMYY = dateformat(date3, 'mmyy');
    const transactions = [
      {
        userId: testUserId,
        item: faker.name.jobTitle(),
        date: date1,
        price: faker.finance.amount(),
        category: 'Income',
        transactionType: 'income',
        monthYearId: date1MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date2,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date2MMYY
      },
      {
        userId: testUserId,
        item: faker.commerce.product(),
        date: date3,
        price: faker.finance.amount(),
        category: 'Misc.',
        transactionType: 'expense',
        monthYearId: date3MMYY
      }
    ];
    Transaction.insertMany(transactions)
      .then(() => {
        chai.request(app)
          .get(`/api/transaction/earliest/${testUserId}/`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0].userId).to.equal(testUserId);
            expect(res.body[0]).excluding(['date', 'id', '_id', '__v', 'createdAt', 'updatedAt']).to.deep.equal(transactions[0]);
            done();
          });
      });
  });
});
