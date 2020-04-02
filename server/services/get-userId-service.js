const User = require('../models/user-model');

function getUserId(req, res) {
    const { query } = req;
    const { token } = query;
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
            return res.status(401).send({
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
    
    return User.findOne({_id: userId})
        .then(user => {
            if(!user){
                return res.status(401).send({
                    message: "User doesn't exist"
                })
            }
            return res.json(user)
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports = { getUserId, getUserName };