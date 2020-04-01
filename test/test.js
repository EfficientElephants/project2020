const mongoose = require('mongoose');
var common = require('./common')
function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}
 
describe('End to End Tests', function() {
    importTest("Testing Login", './features/login-test');
})

// describe('Server Tests', function() {
//     this.timeout(2500);
//     importTest("Testing Transaction Routes", './testing_files/transaction-routes.test.js');
//     importTest("Testing Goal Routes", './testing_files/goal-routes.test.js');
//     // importTest("Testing Server", './testing_files/server.test.js');
// });
