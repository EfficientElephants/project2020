const User = require('../models/user-model');
const validator = require('validator');

function signup(req, res) {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!firstName) {
        return res.status(400).send({
            success: false,
            message: 'Error: First name cannot be blank.',
        });
    }

    if (!lastName) {
        return res.status(400).send({
            success: false,
            message: 'Error: Last name cannot be blank.',
        });
    }

    if (!email) {
        return res.status(400).send({
            success: false,
            message: 'Error: Email cannot be blank.',
        });
    } else {
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                success: false,
                message: 'Error: Email must be in the correct format.',
            });
        }
    }

    if (!password) {
        return res.status(400).send({
            success: false,
            message: 'Error: Password cannot be blank.',
        });
    }

    email = email.toLowerCase();

    // Verify email doesn't exist
    User.find(
        {
            email: email,
        },
        (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            } else if (previousUsers.length > 0) {
                return res.status(403).send({
                    success: false,
                    message: 'Error: Account already exists',
                });
            }
            // Creating new user
            const newUser = new User();
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error',
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up',
                });
            });
        }
    );
}

module.exports = { signup };
