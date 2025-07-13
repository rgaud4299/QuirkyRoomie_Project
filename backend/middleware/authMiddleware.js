const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const asyncHandler = require('express-async-handler'); // Simple wrapper for async functions to handle errors

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]; // Format: "Bearer TOKEN"

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the decoded token and attach to request object
            // Exclude the password from the user object
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    // If no token is found
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };

