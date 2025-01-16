const express = require('express');
const { registerUser, loginUser, getUserProfile, guestLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/guest-login', guestLogin);

module.exports = router;
