// const User = require('../models/user-model')

// require('../mongo').connect();

// function signup(req, res) {
//     const { body } = req;
//     const { 
//         firstName,
//         lastName,
//         password
//     } = body;
//     let {
//         email
//     } = body;

//     if (!firstName) {
//         return res.send({
//             success: false,
//             message: 'Error: First name cannot be blank.'
//         });
//     }

//     if (!lastName) {
//         return res.send({
//             success: false,
//             message: 'Error: Last name cannot be blank.'
//         });
//     }

//     if (!email) {
//         return res.send({
//             success: false,
//             message: 'Error: Email cannot be blank.'
//         });
//     }

//     if (!password) {
//         return res.send({
//             success: false,
//             message: 'Error: Password cannot be blank.'
//         });
//     }

//     email = email.toLowerCase();

//     // Verify email doesn't exist
//     User.find({
//         email: email
//     }, (err, previousUsers) => {
//         if (err) {
//             console.log(err);
//             return res.send({
//                 success: false,
//                 message: 'Error: Server error'
//             });
//         } else if (previousUsers.length > 0) {
//             return res.send({
//                 success: false,
//                 message: 'Error: Account already exists'
//             });
//         } 

//     });
// }

// module.exports = { signup };
