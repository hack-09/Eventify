/**
 * Middleware for user authentication and role-based authorization.
 * This module provides two functions:
 * - `protect`: Verifies the user's JWT and attaches the user object to the request.
 * - `restrictTo`: Restricts access to certain roles based on the user's role.
 */

const jwt = require('jsonwebtoken'); // Library for handling JSON Web Tokens
const User = require('../models/User'); // User model for database interaction

/**
 * Middleware to protect routes by verifying a JSON Web Token (JWT).
 * If a valid token is provided in the `Authorization` header, the user is authenticated,
 * and their information is attached to the `req.user` object.
 * @throws Responds with a 401 Unauthorized status if the token is missing or invalid.
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user associated with the token and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password'); // Excludes the password field for security

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            // Respond with an error if token verification fails
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Respond with an error if no token is provided
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware to restrict access to specific roles.
 * @param {Array} roles - An array of roles allowed to access the route.
 * @returns {Function} Middleware function that checks the user's role.
 * @throws Responds with a 403 Forbidden status if the user does not have access.
 */
exports.restrictTo = (roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next(); // Proceed to the next middleware or route handler
    };
};
