
const mongoose = require('mongoose');
var common = require('./common')
function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}
// describe('Server Tests', function() {
//     importTest("Testing Transaction Routes", './testing_files/transaction-routes.test.js');
// });

describe('End to End Tests', function() {
    importTest("Testing Login", './login-test.js');
})