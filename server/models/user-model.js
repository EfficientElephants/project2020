/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    default: ''
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    index: true,
    unique: true,
    validate: (value) =>
      validator.isEmail(value),
    default: ''
  },
  resetPasswordToken: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
    length: {
      min: 8,
      max: 14
    },
    default: ''
  }
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;
