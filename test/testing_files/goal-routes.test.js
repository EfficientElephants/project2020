/* eslint-disable no-underscore-dangle */
const common = require('../common');

const { assert } = common;
const { expect } = common;
const { chai } = common;
const { app } = common;
const { faker } = common;
const { dateformat } = common;
const { mockdate } = common;

const { Goal } = common;
const { testUserId } = common.options;
const { anotherObjectId } = common.options;


beforeEach((done) => {
  assert.isFulfilled(Goal.deleteMany({}), Error).notify(done);
});

describe('GET', () => {
  it('should return no goals for a test user: date="all"', (done) => {
    chai.request(app)
      .get(`/api/goals/${testUserId}/all`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.of.length(0);
        done();
      });
  });
  it('should return no goals for a test user: date="mmyyId"', (done) => {
    const date = dateformat(faker.date.between('2020-01-01', '2020-04-02'), 'mmyy');
    chai.request(app)
      .get(`/api/goals/${testUserId}/${date}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.of.length(0);
        done();
      });
  });
});

describe('POST', () => {
  describe('Good POST', () => {
    it('should post a goal transaction for current month', (done) => {
      const postGoal = {
        category: 'Food',
        goalAmount: faker.finance.amount(20, 50, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
      };
      chai.request(app)
        .post(`/api/goal?userId=${testUserId}`)
        .send(postGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.spentAmount).to.equal(postGoal.spentAmount);
          expect(res.body.goalAmount).to.equal(postGoal.goalAmount);
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

      it('Should post a goal transaction for January 2020', (done) => {
        mockdate.set('01/01/2020');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Social',
          goalAmount: faker.finance.amount(10, 20, 2),
          spentAmount: faker.finance.amount(20, 50, 2),
        };
        chai.request(app)
          .post(`/api/goal?userId=${testUserId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(mockedDate.toString());
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal(postGoal.spentAmount);
            expect(res.body.goalAmount).to.equal(postGoal.goalAmount);
            expect(res.body.metGoal).to.equal(false);
            expect(res.body.monthYearId).to.equal('0120');
            done();
          });
      });

      it('Should post a goal transaction for December 2019', (done) => {
        mockdate.set('12/24/2019');
        const mockedDate = new Date();
        global.dateTime = new Date();
        const postGoal = {
          category: 'Social',
          goalAmount: faker.finance.amount(10, 20, 2),
          spentAmount: faker.finance.amount(20, 50, 2),
        };
        chai.request(app)
          .post(`/api/goal?userId=${testUserId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(Date(res.body.createdAt).toString()).to.equal(mockedDate.toString());
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.spentAmount).to.equal(postGoal.spentAmount);
            expect(res.body.goalAmount).to.equal(postGoal.goalAmount);
            expect(res.body.metGoal).to.equal(false);
            expect(res.body.monthYearId).to.equal('1219');
            done();
          });
      });
    });
  });
  describe('Bad POST', () => {
    it('should fail if goal already exists for current month and category', (done) => {
      const postGoal = {
        category: 'Food',
        goalAmount: faker.finance.amount(20, 50, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
      };
      const date = faker.date.recent();
      const goal = new Goal({
        userId: testUserId,
        category: 'Food',
        goalAmount: faker.finance.amount(20, 50, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
        metGoal: true,
        monthYearId: dateformat(date, 'mmyy'),
        createdAt: date,
        updatedAt: date
      });
      goal.save(() => {
        chai.request(app)
          .post(`/api/goal?userId=${testUserId}`)
          .send(postGoal)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body._message).to.equal('Goal validation failed');
            done();
          });
      });
    });

    it("should fail if category doesn't exist", (done) => {
      const postGoal = {
        category: 'Rent',
        goalAmount: faker.finance.amount(20, 50, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
      };
      chai.request(app)
        .post(`/api/goal?userId=${testUserId}`)
        .send(postGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body._message).to.equal('Goal validation failed');
          done();
        });
    });

    it('should fail if missing category', (done) => {
      const badPostGoal = {
        goalAmount: faker.finance.amount(20, 50, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
      };
      chai.request(app)
        .post(`/api/goal?userId=${testUserId}`)
        .send(badPostGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Goal validation failed: category: Path `category` is required.');
          done();
        });
    });

    it('should fail if missing goalAmount', (done) => {
      const badPostGoal = {
        category: 'Misc.',
        spentAmount: faker.finance.amount(10, 20, 2),
      };
      chai.request(app)
        .post(`/api/goal?userId=${testUserId}`)
        .send(badPostGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Goal validation failed: goalAmount: Path `goalAmount` is required.');
          done();
        });
    });

    it('should fail if missing spentAmount', (done) => {
      const badPostGoal = {
        category: 'Misc.',
        goalAmount: faker.finance.amount(10, 20, 2),
      };
      chai.request(app)
        .post(`/api/goal?userId=${testUserId}`)
        .send(badPostGoal)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body.message).to.equal('Goal validation failed: spentAmount: Path `spentAmount` is required.');
          done();
        });
    });
  });
});

describe('PUT', () => {
  it('should update goal with field changes', (done) => {
    const goalAmount = faker.finance.amount(20, 50, 2);
    const date = faker.date.recent(20);
    const goals = [{
      userId: testUserId,
      category: 'Food',
      goalAmount,
      spentAmount: faker.finance.amount(10, 20, 2),
      metGoal: true,
      monthYearId: dateformat(date, 'mmyy'),
      createdAt: date,
      updatedAt: date
    }];
    Goal.insertMany(goals)
      .then((goalres) => {
        const updateGoal = JSON.parse(JSON.stringify(goalres[0]));
        updateGoal.spentAmount = faker.finance.amount(50, 60, 2);

        chai.request(app)
          .put('/api/goal')
          .send(updateGoal)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).excluding(['updatedAt', 'metGoal']).to.deep.equal(updateGoal);
            expect(res.body.metGoal).to.equal(false);
            done();
          });
      });
  });

  it("should fail if category doesn't exist", (done) => {
    const goalAmount = faker.finance.amount(20, 50, 2);
    const date = faker.date.recent(20);
    const goals = [{
      userId: testUserId,
      category: 'Food',
      goalAmount,
      spentAmount: faker.finance.amount(10, 20, 2),
      metGoal: true,
      monthYearId: dateformat(date, 'mmyy'),
      createdAt: date,
      updatedAt: date
    }];
    Goal.insertMany(goals)
      .then((goalres) => {
        const updateGoal = JSON.parse(JSON.stringify(goalres[0]));
        updateGoal.category = 'Rent';
        chai.request(app)
          .put('/api/goal')
          .send(updateGoal)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.body.message).to.equal('Goal validation failed: category: Validator failed for path `category` with value `Rent`');
            done();
          });
      });
  });
});


describe('DELETE', () => {
  it('should delete a goal successfully', (done) => {
    const date = faker.date.recent(20);
    const goal = new Goal({
      userId: testUserId,
      category: 'Food',
      goalAmount: faker.finance.amount(20, 30, 2),
      spentAmount: faker.finance.amount(10, 20, 2),
      metGoal: true,
      monthYearId: dateformat(date, 'mmyy'),
      createdAt: date,
      updatedAt: date
    });
    goal.save((err, resGoal) => {
      const delGoal = JSON.parse(JSON.stringify(resGoal));
      chai.request(app)
        .delete(`/api/goal/${delGoal._id}`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal(delGoal);
          done();
        });
    });
  });
  it("should return 400 if goal doesn't exist", (done) => {
    const delGoal = {
      notAReal: 'goal',
      _id: anotherObjectId
    };
    chai.request(app)
      .delete(`/api/goal/${delGoal._id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.text).to.equal('Goal Not Found');
        done();
      });
  });
});

describe('getAllCategories', () => {
  it('should get a list of all distinct categories in the database', (done) => {
    const date1 = faker.date.recent(90);
    const date1MMYY = dateformat(date1, 'mmyy');
    const date2 = faker.date.recent(20);
    const date2MMYY = dateformat(date2, 'mmyy');
    const date3 = faker.date.recent(10);
    const date3MMYY = dateformat(date3, 'mmyy');
    const goals = [
      {
        userId: testUserId,
        category: 'Food',
        goalAmount: faker.finance.amount(20, 30, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
        metGoal: true,
        monthYearId: date1MMYY,
        createdAt: date1,
        updatedAt: date1
      },
      {
        userId: testUserId,
        category: 'Housing',
        goalAmount: faker.finance.amount(20, 30, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
        metGoal: true,
        monthYearId: date2MMYY,
        createdAt: date2,
        updatedAt: date2
      },
      {
        userId: testUserId,
        category: 'Transportation',
        goalAmount: faker.finance.amount(20, 30, 2),
        spentAmount: faker.finance.amount(10, 20, 2),
        metGoal: true,
        monthYearId: date3MMYY,
        createdAt: date3,
        updatedAt: date3
      }
    ];

    const returnCats = [goals[0].category, goals[1].category, goals[2].category];

    Goal.insertMany(goals)
      .then(() => {
        chai.request(app)
          .get(`/api/goal/allCats/${testUserId}/`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(returnCats);
            done();
          });
      });
  });
});
