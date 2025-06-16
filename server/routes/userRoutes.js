const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  googleLogin,
  googleCallback,
} = require('../controllers/authController');
const { 
  updateUserDetails, 
  uploadAvatar, 
  deleteAvatar 
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Google OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// Protected routes
router.use(protect); // Apply protect middleware to all routes below

router.get('/me', getMe);
router.put('/update/user', updateUserDetails);
router.post('/upload/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);

module.exports = router;