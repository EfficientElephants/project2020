const User = require('../models/user-model')

//import crypto from 'crypto';
const crypto = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');

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

function forgotPassword(req, res) {
    console.log('here')
    const { body } = req;
    let {
        email
    } = body;

    email = email.toLowerCase();
    
    //Verify email exists
    User.find({
        email: email
    }, (err, users) => {
        if (err) {
            console.log('error here1: ', err)
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        } 
        if (users.length != 1) {
            console.log('error here2: ', err)
            return res.status(500).send({
                success: false,
                message: 'Error: Invalid Email'
            });
        } 
        const user = users[0];
        console.log('here2')
        const token = crypto.randomBytes(20).toString('hex');
        updateDbToken(user, token)
        console.log('here3')
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            secureConnection: false,
            port: 587,
            tls: {
                ciphers:'SSLv3'
             },
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            }
        });
        console.log('here4')

        transporter.verify((err, res) => {
            if (err) {
                console.log(err)
                console.log('here5')
            } else {
                console.log('Transporter connected')
                console.log('here5a')
            }
        })

        const mailOptions = {
            from: 'expenseelephant@gmail.com',
            to: `${user.email}`,
            subject: 'Password Reset',
            text: 'You are receiving this because you have requested a password reset.\n\n'
            + 'Please click on the following link to reset your password.\n\n'
            + `http://localhost:3000/#/reset/${token}\n\n`
            + `http://project-2020.azurewebsites.net/reset/${token}\n\n`
        };
        console.log('here6')
        transporter.sendMail(mailOptions)
            .then(function(info) {
                return res.send({
                    success: true,
                    message: 'Password reset email sent'
                });
            }).catch(function(err){
                console.log(err);
            });
    });
}

function updateDbToken(user, token) {
    User.findOne( user._id )
    .then(user => {
        user.resetPasswordToken = token;
        user.save()
    })
}

function verifyResetToken(req, res) {
    const { query } = req;
    const { token } = query;
    User.find({
        resetPasswordToken: token
    }, (err, user) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
            
        }
        if (user.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid Session'
            });
        } else {
            return res.send({
                success: true,
                message: 'Token Verified',
                token: token
            });
        }
    });
}


function resetPassword(req, res) {
    const { body } = req;
    const { 
        newPassword,
        token
    } = body;
    User.find({
        resetPasswordToken: token
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
            
        }
        if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid Session'
            });
        } else {
            const user = users[0]
            updateDbToken(user, '')
            //update password
            user.password = user.generateHash(newPassword)
            user.save()
            return res.send({
                success: true,
                message: 'Password is updated'
            }); 
        }
    });

}


module.exports = { login, forgotPassword, verify, resetPassword, verifyResetToken };