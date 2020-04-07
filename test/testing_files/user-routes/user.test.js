/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const common = require('../../common');

const { assert, expect, chai, app, faker } = common;

const { User } = common;
const { anotherObjectId } = common.options;

beforeEach((done) => {
  assert.isFulfilled(User.deleteMany({}), Error).notify(done);
});

describe('User ID', () => {
  it("should successfully get user's ID", (done) => {
    const plainPassword = faker.internet.password();
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
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
          done();
        });
    });
  });
  it('should fail if user is not in database', (done) => {
    chai
      .request(app)
      .get(`/api/getUserId?token=${anotherObjectId}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Error: Invalid Session');
        done();
      });
  });
});

describe('User Information', () => {
  it("should get all user's information", (done) => {
    const plainPassword = faker.internet.password();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const user = new User({
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName),
    });
    user.password = user.generateHash(plainPassword);
    user.save((err, resUser) => {
      const savedUser = JSON.parse(JSON.stringify(resUser));
      chai
        .request(app)
        .get(`/api/users/${savedUser._id}`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal(savedUser);
          done();
        });
    });
  });
  it('should fail if user not in database', (done) => {
    chai
      .request(app)
      .get(`/api/users/${anotherObjectId}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.message).to.equal("User doesn't exist");
        done();
      });
  });
});
