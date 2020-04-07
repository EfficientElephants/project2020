/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user-model');

function login(req, res) {
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;

  email = email.toLowerCase();

  // Verify user in db.
  User.find({
    email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error3'
      });
    }
    if (users.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Username'
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Password'
      });
    }

    // If correct user create send valid response
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
    if (sessions.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Session'
      });
    }
    return res.send({
      success: true,
      message: 'Valid Session'
    });
  });
}

function updateDbToken(userObj, token) {
  User.findOne(userObj._id)
    .then((resuser) => {
      const user = resuser;
      user.resetPasswordToken = token;
      user.save();
    })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      res.status(500).send(err);
    });
}

function forgotPassword(req, res) {
  const { body } = req;
  let {
    email
  } = body;

  email = email.toLowerCase();
  // Verify email exists
  User.find({
    email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (users.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Email'
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
      tls: { ciphers: 'SSLv3' }
    });

    transporter.verify((error) => {
      if (error) {
        return res.send({
          success: false,
          message: 'Password reset email cannot be sent'
        });
      }
    });

    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${user.email}`,
      subject: 'Password Reset',
      text: 'You are receiving this because you have requested a password reset.\n\n' +
            'Please click on the following link to reset your password.\n\n' +
            `http://localhost:3000/#/reset/${token}\n\n` +
            `https://project-2020.azurewebsites.net/#/reset/${token}\n\n` +
            `https://expense-elephant.azurewebsites.net/#/reset/${token}\n\n`
    };

    transporter.sendMail(mailOptions, (error2) => {
      if (error2) {
        return res.send({
          success: false,
          message: 'Password reset email cannot be sent'
        });
      }
      return res.send({
        success: true,
        message: 'Password reset email sent'
      });
    });
  });
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
    if (user.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Session'
      });
    }
    return res.send({
      success: true,
      message: 'Token Verified',
      token
    });
  });
}

function resetPassword(req, res) {
  const { body } = req;
  const {
    newPassword,
    token
  } = body;
  User.find({ resetPasswordToken: token })
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).send({
          success: false,
          message: 'Error: Invalid Session'
        });
      }
      const user = users[0];
      updateDbToken(user, '');
      // update password
      user.password = user.generateHash(newPassword);
      user.save()
        .then(() =>
          res.send({
            success: true,
            message: 'Password is updated'
          }))
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports = { login, verify, forgotPassword, resetPassword, verifyResetToken };
