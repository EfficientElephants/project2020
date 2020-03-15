var server = require('../../server/server');

before( function(done){
    console.log(server.server);
})

it("Server tests", function(done){
    console.log(server.server);
    console.log(server.address()); 
})