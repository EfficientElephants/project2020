const User = require('../models/user-model')
const UserSession = require('../models/user-session-model')

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
                console.log(err);
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

    //Verify that the token is one of a kind
    // and not deleted

    //for testing
    //api/verify?token=(token number here)

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
                message: 'Valid Session'
            });
        }
    });
}

function forgotPassword(req, res) {
    const { body } = req;
    let {
        email
    } = body;

    email = email.toLowerCase();
    console.log('hi', email);
    
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
            return res.send({
                success: false,
                message: 'Error: Invalid Email'
            });
        } 
        const user = users[0];

        const token = crypto.randomBytes(20).toString('hex');
        user.update({
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000,
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            }
        });

        transporter.verify((err, res) => {
            if (err) {
                console.log('transport error: ', err)
            } else {
                console.log('All works fine')
            }
        })

        const mailOptions = {
            from: 'expenseelephant@gmail.com',
            to: 'expenseelephant@gmail.com',
            //to: `${user.email}`,
            subject: 'Password Reset',
            text: 'You are receiving this because you have requested a password reset.\n\n'
            + 'Please click on the following link to reset your password.\n\n'
            //+ `http://localhost:3000/reset/${token}\n\n`
        };

        console.log('here')
        transporter.sendMail(mailOptions, (err, response) => {
            console.log('here1', response)
            if (err) {
                console.log('error here: ', err)
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } 
            return response.send({
                success: true,
                message: 'Password reset email sent'
            });
        });
    });
}


module.exports = { login, verify, forgotPassword };