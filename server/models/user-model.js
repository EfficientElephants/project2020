import { Schema as _Schema, model } from 'mongoose';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { isEmail } from 'validator';
import { uniqueValidator } from 'mongoose-unique-validator';

const Schema = _Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        default: '',
    },
    lastName: {
        type: String,
        required: true,
        default: '',
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        index: true,
        unique: true,
        validate: (value) => {
            return isEmail(value);
        },
        default: '',
    },
    resetPasswordToken: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
        length: {
            min: 8,
            max: 14,
        },
        default: '',
    },
});

function generateHash(password) {
    return hashSync(password, genSaltSync(8), null);
}

function validPassword(password) {
    return compareSync(password, this.password);
}

userSchema.methods.generateHash = generateHash;

userSchema.methods.validPassword = validPassword;

userSchema.plugin(uniqueValidator);
const User = model('User', userSchema);
module.exports = User;
