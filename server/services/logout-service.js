const UserSession = require('../models/user-session-model');

require('../mongo').connect();

function logout(req, res) {
    const { query } = req;
    const { token } = query;

    //for testing
    //api/logout?token=(token number here)

    UserSession.findOneAndUpdate({
        userId: token,
        isLoggedOut: false
    }, 
    {$set:{isLoggedOut:true}}, null, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.send({
            success: true,
            message: 'Valid Session'
        });
    
    });
}

module.exports = { logout };