const UserSession = require('../models/user-session-model');
const User = require('../models/user-model');

require('../mongo').connect();

function getUserId(req, res) {
    const { query } = req;
    const { token } = query;
    
    UserSession.find({
        _id: token,
        isLoggedOut: false
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
                message: 'Valid Session',
                userId: sessions[0].userId
            });
        }
    });
}

function getUserName(req, res) {
    const { userId } = req.params;
    let firstName = "";
    let lastName = "";
    
    return User.find({_id: userId})
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports = { getUserId, getUserName };