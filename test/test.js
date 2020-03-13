const mongoose = require('mongoose');
var common = require('./common')
function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}
describe('Server Tests', function() {
    importTest("Testing Transaction Routes", './testing_files/transaction-routes.test.js');
  });