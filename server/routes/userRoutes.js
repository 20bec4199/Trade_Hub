const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  googleLogin,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Google OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;