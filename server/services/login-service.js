const User = require('../models/user-model')

require('../mongo').connect();

function login(req, res) {
    const { body } = req;
    const { 
        password
    } = body;
    let {
        email
    } = body;

    email = email.toLowerCase();
    console.log(body)

    //Verify user in db. If not there create an entry.
    User.find({
        email: email
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error3'
            });
        } 
        if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid Username'
            });
        } 
        const user = users[0];
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Error: Invalid Password'
            });
        }

    //If correct user create send valid response
    return res.send({
        success: true,
        message: 'Valid login',
        token: user._id
    });
  });
}

function verify(req, res) {
    const { query } = req;
    const { token } = query;

    // Verify that the token is one of a kind
    // and not deleted

    // for testing
    // api/verify?token=(token number here)

    User.find({
        _id: token
    }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
            
        }
        if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid Session'
            });
        } else {
            return res.send({
                success: true,
                message: 'Valid Session'
            });
        }
    });
}


module.exports = { login, verify };