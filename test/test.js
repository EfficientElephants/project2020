// const mongoose = require('mongoose');

// const dotenv = require('dotenv').config();
// mongoURI = process.env.CONNECTION_STRING_TESTING

// var common = require('./common')

// function importTest(name, path) {
//     describe(name, function () {
//         require(path);
//     });
// }

// describe('Database Tests', function() {
//     before(function (done) {
//         mongoose.connect(mongoURI, {useFindAndModify: false, autoIndex: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
//         const db = mongoose.connection;
//         db.on('error', console.error.bind(console, 'connection error'));
//         db.once('open', function() {
//             console.log('Connected to test database!');
//             done();
//         });

//     });

//     importTest("Testing User Database", './models/user-model.test.js');

//     //After all tests are finished drop database and close connection
//     after(function(done){
//     //   mongoose.connection.db.dropDatabase(function(){
//         mongoose.connection.close(done);
//       });
//     // });
//   });