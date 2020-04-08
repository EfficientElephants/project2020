/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const {
  assert,
  expect,
  chai,
  app,
  faker,
  User,
  Transaction,
  mongoConn,
  mockdate
} = require('./test/common');

describe('Mocking Data', function () {
  this.timeout(2500);
  let userId;
  before((done) => {
    mongoConn
      .connect()
      .then(() =>
        assert.isFulfilled(User.findOneAndDelete({
          email: 'test-expense-elephant@outlook.com'
        })
          .then((user) => {
            if (user) {
              Transaction.deleteMany({
                userId: user._id
              });
            }
          }), Error).notify(done))
      .catch((err) =>
        done(err));
  });
  after((done) => {
    mongoConn
      .close()
      .then(() =>
        done())
      .catch((err) =>
        done(err));
  });
  it('Should create a new User', (done) => {
    const plainPassword = 'Elephant@123';
    const user = new User({
      firstName: 'Elephant',
      lastName: 'Tester',
      email: 'test-expense-elephant@outlook.com'
    });
    user.password = user.generateHash(plainPassword);
    user.save((err, resUser) => {
      const savedUser = JSON.parse(JSON.stringify(resUser));
      chai
        .request(app)
        .get(`/api/getUserId?token=${savedUser._id}`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('Valid Session');
          expect(res.body.userId).to.equal(savedUser._id);
          userId = res.body.userId;
          done();
        });
    });
  });
  it('Should add Transactions', (done) => {
    const testingdata = [{
      userId,
      date: faker.date.between('04-01-2020', '04-7-2020'),
      item: 'Groceries',
      price: 72.00,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0420'
    },
    {
      userId,
      date: faker.date.between('03-01-2020', '03-6-2020'),
      item: 'Groceries',
      price: 64.21,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('03-15-2020', '03-30-2020'),
      item: 'Groceries',
      price: 25.31,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-15-2020'),
      item: 'Groceries',
      price: 56.78,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('02-15-2020', '02-29-2020'),
      item: 'Groceries',
      price: 20.98,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-20-2020'),
      item: 'Groceries',
      price: 62.39,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-20-2020'),
      item: 'Groceries',
      price: 62.39,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('01-21-2020', '01-31-2020'),
      item: 'Groceries',
      price: 12.78,
      category: 'Food',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: new Date('01-01-2020'),
      item: 'Rent',
      price: 575.00,
      category: 'Housing',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: new Date('02-01-2020'),
      item: 'Rent',
      price: 575.00,
      category: 'Housing',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: new Date('03-01-2020'),
      item: 'Rent',
      price: 575.00,
      category: 'Housing',
      transactionType: 'expense',
      monthYearId: '0320'
    },
    {
      userId,
      date: new Date('04-01-2020'),
      item: 'Rent',
      price: 575.00,
      category: 'Housing',
      transactionType: 'expense',
      monthYearId: '0420'
    },
    {
      userId,
      date: new Date('01-13-20'),
      item: 'Movie-Frozen 2',
      price: 29.09,
      category: 'Social',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-29-2020'),
      item: 'Pulpit Rock',
      price: 25.78,
      category: 'Social',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-29-2020'),
      item: 'Pulpit Rock',
      price: 14.34,
      category: 'Social',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('03-01-2020', '03-31-2020'),
      item: 'Pulpit Rock',
      price: 12.12,
      category: 'Social',
      transactionType: 'expense',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('03-01-2020', '03-31-2020'),
      item: 'Dentist',
      price: 225.00,
      category: 'Healthcare',
      transactionType: 'expense',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-29-2020'),
      item: 'MRI Test',
      price: 300.00,
      category: 'Healthcare',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-31-2020'),
      item: 'Flu Shot',
      price: 25.00,
      category: 'Healthcare',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-31-2020'),
      item: 'Bus Pass',
      price: 150.00,
      category: 'Transportation',
      transactionType: 'expense',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-29-2020'),
      item: 'Tires',
      price: 400.00,
      category: 'Transportation',
      transactionType: 'expense',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('04-01-2020', '04-07-2020'),
      item: 'Gas',
      price: 23.54,
      category: 'Transportation',
      transactionType: 'expense',
      monthYearId: '0420'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-14-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('01-15-2020', '01-29-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-12-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('02-13-2020', '02-29-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('03-01-2020', '03-14-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('03-15-2020', '03-28-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('04-01-2020', '04-7-2020'),
      item: 'Paycheck',
      price: 280.20,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0420'
    },
    {
      userId,
      date: faker.date.between('01-01-2020', '01-14-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('01-15-2020', '01-29-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0120'
    },
    {
      userId,
      date: faker.date.between('02-01-2020', '02-12-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('02-13-2020', '02-29-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0220'
    },
    {
      userId,
      date: faker.date.between('03-01-2020', '03-14-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('03-15-2020', '03-28-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0320'
    },
    {
      userId,
      date: faker.date.between('04-01-2020', '04-7-2020'),
      item: 'Work Study',
      price: 75.00,
      category: 'Income',
      transactionType: 'income',
      monthYearId: '0420'
    },
    ];
    Transaction.insertMany(testingdata)
      .then(() =>
        done());
  });
  describe('Should add Goals', () => {
    it('should post a Food goal for current month', (done) => {
      const postGoal = {
        category: 'Food',
        goalAmount: 140.00,
        spentAmount: 72.00,
      };
      chai
        .request(app)
        .post(`/api/goal?userId=${userId}`)
        .send(postGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.spentAmount).to.equal('72.00');
          expect(res.body.goalAmount).to.equal('140.00');
          expect(res.body.metGoal).to.equal(true);
          done();
        });
    });
    it('should post a Housing goal for current month', (done) => {
      const postGoal = {
        category: 'Housing',
        goalAmount: 575.00,
        spentAmount: 575.00,
      };
      chai
        .request(app)
        .post(`/api/goal?userId=${userId}`)
        .send(postGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.spentAmount).to.equal('575.00');
          expect(res.body.goalAmount).to.equal('575.00');
          expect(res.body.metGoal).to.equal(true);
          done();
        });
    });
    it('should post a Social goal for current month', (done) => {
      const postGoal = {
        category: 'Social',
        goalAmount: 60.00,
        spentAmount: 0.00,
      };
      chai
        .request(app)
        .post(`/api/goal?userId=${userId}`)
        .send(postGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.spentAmount).to.equal('0.00');
          expect(res.body.goalAmount).to.equal('60.00');
          expect(res.body.metGoal).to.equal(true);
          done();
        });
    });

    describe('Mocked Dates', () => {
      afterEach((done) => {
        mockdate.reset();
        global.dateTime = new Date();
        done();
      });

      it('Should post a food goal for January 2020', (done) => {
        mockdate.set('01/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Food',
          goalAmount: 140.00,
          spentAmount: 137.56,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('137.56');
            expect(res.body.goalAmount).to.equal('140.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0120');
            done();
          });
      });
      it('Should post a housing goal for January 2020', (done) => {
        mockdate.set('01/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Housing',
          goalAmount: 500.00,
          spentAmount: 575.00,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('575.00');
            expect(res.body.goalAmount).to.equal('500.00');
            expect(res.body.metGoal).to.equal(false);
            expect(res.body.monthYearId).to.equal('0120');
            done();
          });
      });
      it('Should post a social goal for January 2020', (done) => {
        mockdate.set('01/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Social',
          goalAmount: 60.00,
          spentAmount: 29.09,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('29.09');
            expect(res.body.goalAmount).to.equal('60.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0120');
            done();
          });
      });

      it('Should post a food goal for Feb 2020', (done) => {
        mockdate.set('02/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Food',
          goalAmount: 140.00,
          spentAmount: 77.76,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('77.76');
            expect(res.body.goalAmount).to.equal('140.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0220');
            done();
          });
      });
      it('Should post a housing goal for Feb 2020', (done) => {
        mockdate.set('02/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Housing',
          goalAmount: 575.00,
          spentAmount: 575.00,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('575.00');
            expect(res.body.goalAmount).to.equal('575.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0220');
            done();
          });
      });
      it('Should post a social goal for Feb 2020', (done) => {
        mockdate.set('02/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Social',
          goalAmount: 60.00,
          spentAmount: 29.09,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('29.09');
            expect(res.body.goalAmount).to.equal('60.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0220');
            done();
          });
      });

      it('Should post a food goal for March 2020', (done) => {
        mockdate.set('03/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Food',
          goalAmount: 140.00,
          spentAmount: 89.52,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('89.52');
            expect(res.body.goalAmount).to.equal('140.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0320');
            done();
          });
      });
      it('Should post a housing goal for March 2020', (done) => {
        mockdate.set('03/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Housing',
          goalAmount: 575.00,
          spentAmount: 575.00,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('575.00');
            expect(res.body.goalAmount).to.equal('575.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0320');
            done();
          });
      });
      it('Should post a social goal for March 2020', (done) => {
        mockdate.set('03/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Social',
          goalAmount: 60.00,
          spentAmount: 12.12,
        };
        chai
          .request(app)
          .post(`/api/goal?userId=${userId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(
              mockedDate.toString()
            );
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal('12.12');
            expect(res.body.goalAmount).to.equal('60.00');
            expect(res.body.metGoal).to.equal(true);
            expect(res.body.monthYearId).to.equal('0320');
            done();
          });
      });
    });
  });
});
