/**
 * authRoutes.js: Express routes for user authentication and handling sessions.
 * These routes define the API endpoints for user registration, login, accessing user profiles,
 * and guest login.
 */

const express = require('express');
const { registerUser, loginUser, getUserProfile, guestLogin } = require('../controllers/authController'); // Importing controller functions
const { protect } = require('../middlewares/authMiddleware'); // Importing middleware to protect routes
const router = express.Router(); // Create a new instance of Express Router

// **Routes**

/**
 * @route POST /register
 * @description Route to handle user registration
 * @access Public
 */
router.post('/register', registerUser);

/**
 * @route POST /login
 * @description Route to handle user login
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route GET /profile
 * @description Route to retrieve user profile. Protected route - requires authentication.
 * @access Private
 */
router.get('/profile', protect, getUserProfile);

/**
 * @route POST /guest-login
 * @description Route to handle guest login
 * @access Public
 */
router.post('/guest-login', guestLogin);

// Exporting the router for use in the main application
module.exports = router;
