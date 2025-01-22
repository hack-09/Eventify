// Import required modules
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Token generation and verification
const User = require('../models/User'); // Import the User model for interacting with the database

/**
 * Utility function to generate a JWT.
 * @param {string} id - The ID of the user for whom the token is being generated.
 * @returns {string} - A signed JWT with the user's ID and expiration of 30 days.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Controller to register a new user.
 * Handles user creation, password hashing, and token generation.
 * @param {Object} req - The request object containing the user's name, email, and password.
 * @param {Object} res - The response object used to send back data to the client.
 */
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the user's password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Create a new user in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Respond with user details and a JWT
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id), // Generate a token for the new user
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to log in an existing user.
 * Verifies email and password, then generates a JWT for authentication.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object used to send back data to the client.
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Verify the user's password and respond with user details and a JWT
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id), // Generate a token for the user
            });
        } else {
            // Handle invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to retrieve the authenticated user's profile.
 * Excludes the password field from the response for security.
 * @param {Object} req - The request object containing the authenticated user's ID.
 * @param {Object} res - The response object used to send back the user's profile.
 */
exports.getUserProfile = async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to log in as a guest user.
 * Generates a temporary JWT for guest access.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the guest token.
 */
exports.guestLogin = async (req, res) => {
    try {
        // Generate a JWT for a guest user with a limited expiration time
        const token = jwt.sign({ role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the guest token and role
        res.status(200).json({
            message: 'Guest access granted',
            token,
            role: 'guest',
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};
