const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const beautifyUnique = require('mongoose-beautiful-unique-validation');
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({
    id: { type: Number, required: true, index: true, unique: true },
    name: String,
    password: String
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;