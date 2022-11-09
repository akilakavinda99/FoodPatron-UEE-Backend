const User = require('../models/user');
const Organization = require('../models/organization.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Requester = require('../models/requester.model');

const handleLogin = async (req, res) => {
    const { password, email } = req.body;
    let foundUser;
    if (!email && !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    foundUser = await Requester.findOne({ email: email }).exec();
    if (!foundUser) {
        foundUser = await Organization.findOne({ email: email }).exec();
        if (!foundUser) {
            return res.status(401).json({ 'message': 'User not found.' }); //Unauthorized 
        }
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        const roles = foundUser.roles;
        const _id = (foundUser._id);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles,
                    "_id": _id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ roles, accessToken, userID: _id });
    } else {
        return res.status(401).json({ 'message': 'Incorrect password.' }); //Unauthorized 
    }
}

module.exports = { handleLogin };