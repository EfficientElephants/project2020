const UserSession = require('../models/user-session-model')

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

module.exports = { getUserId };