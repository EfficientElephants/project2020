/* eslint-disable consistent-return */
import { isEmail } from 'validator';
import User from '../models/user-model';

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
    }
    if (!isEmail(email)) {
        return res.status(400).send({
            success: false,
            message: 'Error: Email must be in the correct format.',
        });
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
            email,
        },
        (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            }
            if (previousUsers.length > 0) {
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
            newUser.save((err2) => {
                if (err2) {
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

export default { signup };
