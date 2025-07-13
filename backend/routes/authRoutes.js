const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        try {
            const { name, email, password, flatCode } = req.body;

            if (!name || !email || !password || !flatCode) {
                res.status(400);
                throw new Error('Please enter all fields');
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                res.status(400);
                throw new Error('User already exists');
            }

            const user = await User.create({
                name,
                email,
                password,
                flatCode,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    flatCode: user.flatCode,
                    karmaPoints: user.karmaPoints,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400);
                throw new Error('Invalid user data');
            }
        } catch (error) {
            console.error('Registration Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    })
);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                flatCode: user.flatCode,
                karmaPoints: user.karmaPoints,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    })
);

module.exports = router;
