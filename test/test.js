const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;
const dotenv = require('dotenv').config();
const mongoURI = CONNECTION_STRING_TESTING;


// Import User Information
const User = require('../server/models/user-model');

//Create test schema
// 'name' is a required field
const testSchema = new Schema({
    name: { type: String, required: true }
  });

//Create a new collection called 'Name'
const Name = mongoose.model('Name', testSchema);

describe('Database Tests', function() {

    //Before starting the test, create a sandboxed database connection
    //Once a connection is established invoke done()
    before(function (done) {
        mongoose.connect(mongoURI, {useFindAndModify: false, autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });

    });

    describe('Test Database', function() {
      //Save object with 'name' value of 'Mike"
      it('New name saved to test database', function(done) {
        var testName = Name({
          name: 'Mike'
        });
   
        testName.save(done);
      });
      it('Dont save incorrect format to database', function(done) {
        //Attempt to save with wrong info. An error should trigger
        var wrongSave = Name({
          notName: 'Not Mike'
        });
        wrongSave.save(err => {
          if(err) { return done(); }
          throw new Error('Should generate error!');
        });
      });
      it('Should retrieve data from test database', function(done) {
        //Look up the 'Mike' object previously saved.
        Name.find({name: 'Mike'}, (err, name) => {
          if(err) {throw err;}
          if(name.length === 0) {throw new Error('No data!');}
          done();
        });
      });
    });
    
    describe('Testing User Database', function() {
        //Need to remove all entries before starting tests
        before(function (done) {
            User.deleteMany({}, function(err) {
                if (err) return done(err);});
            done();
        });

        it('Save test user', function(done){
            var testUser = User({
                firstName: "Test",
                lastName: "Tester",
                email: "test@test.com",
                password: "te$ting2020"
            });
            testUser.save(done);
        });

        describe('Dont save in database incorrectly', function() {
            it("Don't save is missing required information", function(done) {
                var incorrectUser1 = User({
                    firstName: "Only First Name"
                })
                incorrectUser1.save(err => {
                    if (err) {return done(); }
                    throw new Error('Should generate error!');
                });
            });

            it("Don't save user with same email", function(done){
                var incorrectUser2 = User({
                    firstName: "Testing 2",
                    lastName: "Test",
                    email: "test@test.com",
                    password: "testing2020"
                });
                assert.isRejected(incorrectUser2.save(), Error).notify(done);
            });

            it("Don't save if email is not an email", function(done){
                var incorrectUser3 = User({
                    firstName: "Testing 3",
                    lastName: "Test",
                    email: "test3",
                    password: "testing2020"
                });
                assert.isRejected(incorrectUser3.save(), Error).notify(done);
            });
        });
    });

    //After all tests are finished drop database and close connection
    after(function(done){
    //   mongoose.connection.db.dropDatabase(function(){
        mongoose.connection.close(done);
      });
    // });
  });