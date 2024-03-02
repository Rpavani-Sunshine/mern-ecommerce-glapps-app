const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const generateToken = (userdata) => {
    return jwt.sign(
        {
            _id: userdata._id,
            username: userdata.User_name,
            email: userdata.email,
            isAdmin: userdata.isAdmin,
        }, 
        process.env.JWT_Secret, 
        {
        expiresIn: '90d',
        }
    );
};

module.exports = generateToken;