const User = require('../models/user-model');

const crypto = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');

function login(req, res) {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    email = email.toLowerCase();

    //Verify user in db.
    User.find(
        {
            email: email,
        },
        (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error3',
                });
            }
            if (users.length != 1) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Username',
                });
            }
            const user = users[0];
            if (!user.validPassword(password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Password',
                });
            }

            //If correct user create send valid response
            return res.send({
                success: true,
                message: 'Valid login',
                token: user._id,
            });
        }
    );
}

function verify(req, res) {
    const { query } = req;
    const { token } = query;

    // Verify that the token is one of a kind
    // and not deleted

    // for testing
    // api/verify?token=(token number here)

    User.find(
        {
            _id: token,
        },
        (err, sessions) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            }
            if (sessions.length != 1) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Session',
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Valid Session',
                });
            }
        }
    );
}

function forgotPassword(req, res) {
    const { body } = req;
    let { email } = body;

    email = email.toLowerCase();
    //Verify email exists
    User.find(
        {
            email: email,
        },
        (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            }
            if (users.length != 1) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Email',
                });
            }
            const user = users[0];
            const token = crypto.randomBytes(20).toString('hex');
            updateDbToken(user, token);

            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: `${process.env.EMAIL_ADDRESS}`,
                    pass: `${process.env.EMAIL_PASSWORD}`,
                },
                tls: { ciphers: 'SSLv3' },
            });

            transporter.verify((err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Password reset email cannot be sent',
                    });
                }
            });

            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${user.email}`,
                subject: 'Password Reset',
                text:
                    'You are receiving this because you have requested a password reset.\n\n' +
                    'Please click on the following link to reset your password.\n\n' +
                    `http://localhost:3000/#/reset/${token}\n\n` +
                    `https://project-2020.azurewebsites.net/#/reset/${token}\n\n` +
                    `https://expense-elephant.azurewebsites.net/#/reset/${token}\n\n`,
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Password reset email cannot be sent',
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Password reset email sent',
                    });
                }
            });
        }
    );
}

function updateDbToken(user, token) {
    User.findOne(user._id)
        .then((user) => {
            user.resetPasswordToken = token;
            user.save();
        })
        .catch((err) => {
            err.status(500).send(err);
        });
}

function verifyResetToken(req, res) {
    const { query } = req;
    const { token } = query;
    User.find(
        {
            resetPasswordToken: token,
        },
        (err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            }
            if (user.length != 1) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Session',
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Token Verified',
                    token: token,
                });
            }
        }
    );
}

function resetPassword(req, res) {
    const { body } = req;
    const { newPassword, token } = body;
    User.find({ resetPasswordToken: token })
        .then((users) => {
            if (users.length != 1) {
                return res.status(401).send({
                    success: false,
                    message: 'Error: Invalid Session',
                });
            } else {
                const user = users[0];
                updateDbToken(user, '');
                //update password
                user.password = user.generateHash(newPassword);
                user.save()
                    .then(() => {
                        return res.send({
                            success: true,
                            message: 'Password is updated',
                        });
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

module.exports = {
    login,
    verify,
    forgotPassword,
    resetPassword,
    verifyResetToken,
};
