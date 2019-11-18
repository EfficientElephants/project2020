const User = require('../models/user-model')
const UserSession = require('../models/user-session-model')

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

    //Verify email exists
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

        //If correct user create session
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error4'
                });
            }
            return res.send({
                success: true,
                message: 'Valid login',
                token: doc._id
            });
        });
    });
}

function verify(req, res) {
    const { query } = req;
    const { token } = query;
    console.log(token)

    //Verify that the token is one of a kind
    // and not deleted

    //for testing
    //api/verify?token=(token number here)

    UserSession.find({
        userId: token,
        isLoggedOut: false
    }, (err, sessions) => {
        console.log(sessions);
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (sessions.length != 1) {
            console.log(sessions.length);
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