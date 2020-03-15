var common = require("../common");
var options = common.options;
var assert = common.assert;
var expect = common.expect;
var chai = common.chai;
var app = common.app;
var dateformat = common.dateformat;
var moment = common.moment;
var mockdate = common.mockdate;
var Goal = common.Goal;
var testToken = common.loginResponse.token;

var dateToUse = new Date();
var mmyyIdToUse = dateformat(dateToUse, 'mmyy');
var goal = {};
var goalJan2020 = {};
var delGoal = {}

before(function (done) {
    //appServer = server.listen(3002, done)
    assert.isFulfilled(Goal.deleteMany({}), Error).notify(done);
});

describe("GET", function() {
    it('Should return 0 goals for test User', function(done) {
        chai.request(app)
            .get(`/api/goals/${testToken}/${mmyyIdToUse}`)
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
    it("Should post a goal transaction for current month", function(done){
        chai.request(app)
            .post(`/api/goal?userId=${testToken}`)
            .send({
                category: 'Food',
                goalAmount: 50.98,
                spentAmount: common.thisMonthFood/100,
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.spentAmount).to.equal('76.32');
                expect(res.body.goalAmount).to.equal('50.98');
                expect(res.body.metGoal).to.equal(false);
                goal = res.body;
                done();
            })
    });

    it("Should post a second goal", function(done){
        chai.request(app)
            .post(`/api/goal?userId=${testToken}`)
            .send({
                category: 'Healthcare',
                goalAmount: 100.00,
                spentAmount: 0,
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                delGoal = res.body;
                expect(res.body).to.be.an('object');
                expect(res.body.spentAmount).to.equal('0.00');
                expect(res.body.goalAmount).to.equal('100.00');
                expect(res.body.metGoal).to.equal(true);
                done();
            })
    });

    it("Should fail if goal already exists for current month and category", function(done) {
        chai.request(app)
            .post(`/api/goal?userId=${testToken}`)
            .send({
                category: 'Food',
                goalAmount: 67.98,
                spentAmount: common.thisMonthFood/100,
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body._message).to.equal('Goal validation failed');
                done();
            })
    });

    it("Should fail if category doesn't exist", function(done){
        chai.request(app)
            .post(`/api/goal?userId=${testToken}`)
            .send({
                category: 'Rent',
                goalAmount: 575,
                spentAmount: 0,
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body._message).to.equal('Goal validation failed');
                done();
            })
    });

    it('Should return 2 goals for test User with current mmyyID', function(done) {
        chai.request(app)
            .get(`/api/goals/${testToken}/${mmyyIdToUse}`)
            // .send({userId: testToken})
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(2);
                done();
            })
    });

    describe("Mocked Dates", function(){
        afterEach(function(done) {
            mockdate.reset();
            global.dateTime = new Date();
            done();
        });

        it("Should post a goal transaction for January 2020", function(done){
            mockdate.set('01/01/2020');
            var mockedDate = new Date();
            global.dateTime  = new Date();
            
            chai.request(app)
                .post(`/api/goal?userId=${testToken}`)
                .send({
                    category: "Social",
                    goalAmount: 20.12,
                    spentAmount: 0
                })
                .end((err, res) => {
                    expect(Date(res.body.createdAt).toString()).to.equal(mockedDate.toString());
                    expect(res.statusCode).to.equal(200);
                    goalJan2020 = res.body;
                    expect(res.body).to.be.an('object');
                    expect(res.body.spentAmount).to.equal('0.00');
                    expect(res.body.goalAmount).to.equal('20.12');
                    expect(res.body.metGoal).to.equal(true);
                    expect(res.body.monthYearId).to.equal('0120');
                    done();
                });
        });

        it("Should post a goal transaction for December 2019", function(done){
            mockdate.set('12/24/2019');
            var mockedDate = new Date();
            global.dateTime  = new Date();
            
            chai.request(app)
                .post(`/api/goal?userId=${testToken}`)
                .send({
                    category: "Social",
                    goalAmount: 20.12,
                    spentAmount: 0
                })
                .end((err, res) => {
                    expect(Date(res.body.createdAt).toString()).to.equal(mockedDate.toString());
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.spentAmount).to.equal('0.00');
                    expect(res.body.goalAmount).to.equal('20.12');
                    expect(res.body.metGoal).to.equal(true);
                    expect(res.body.monthYearId).to.equal('1219');
                    done();
                });
        });

        it('Should return 1 goals for test User during January 2020', function(done) {
            chai.request(app)
                .get(`/api/goals/${testToken}/0120`)
                // .send({userId: testToken})
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.of.length(1);
                    done();
                })
        });
    });

});

describe("PUT", function(){
    it('should update goal with field changes', function (done){
        var foodTotal = common.thisMonthFood
        goal.goalAmount = (foodTotal/100).toString();;
        chai.request(app)
            .put('/api/goal')
            .send(goal)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).excluding('updatedAt').to.deep.equal(goal);
                done();
            })
    });

    it("should fail if category doesn't exist", function (done){
        goal2 = JSON.parse(JSON.stringify(goalJan2020))
        goal2.category = 'Rent';
        chai.request(app)
            .put('/api/transaction')
            .send(goal2)
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                //expect(res.body).excluding('updatedAt').to.deep.equal(transaction);
                done();
            })
    });

    it("should fail if _id doesn't exist", function (done){
        goal3 = JSON.parse(JSON.stringify(goalJan2020))
        goal3._id = '1234';
        chai.request(app)
            .put('/api/goal')
            .send(goal3)
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                //expect(res.body).excluding('updatedAt').to.deep.equal(transaction);
                done();
            })
    });
});

describe("DELETE", function() {
    it("should delete a goal successfully", function (done){
        console.log(delGoal);
        chai.request(app)
            .delete(`/api/goal/${delGoal._id}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.deep.equal(delGoal);
                done();
            })
    });

    it('should have 1 transactions for testUser with date=mmyyidtouse', function(done){
        chai.request(app)
            .get(`/api/goals/${testToken}/${mmyyIdToUse}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.of.length(1);
                done();
            })
    });

    it("should fail if goal doesn't exist", function (done){
        chai.request(app)
            .delete(`/api/goal/${delGoal._id}`)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.equal("Goal Not Found");
                done();
            })
    });
});