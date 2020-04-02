const User = require('../models/user-model');

// require('../mongo').connect();

function getUserId(req, res) {
    const { query } = req;
    const { token } = query;
    User.find({
        _id: token
    }, (err, sessions) => {
        if (err) {
            console.log(err)
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
                userId: token
            });
        }
    });
}

function getUserName(req, res) {
    const { userId } = req.params;
      
    return User.find({_id: userId})
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports = { getUserId, getUserName };