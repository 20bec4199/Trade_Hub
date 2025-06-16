const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const path = require('path');
const fs = require('fs');

// Helper function to delete old avatar file
const deleteOldAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (user.avatar && user.avatar !== '') {
    const avatarPath = path.join(__dirname, `${user.avatar}`);
    if (fs.existsSync(avatarPath)) {
      fs.unlink(avatarPath, (err) => {
        if (err) console.error('Error deleting old avatar:', err);
      });
    }
  }
};


exports.uploadAvatar = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler('No file uploaded', 400));
  }

  // 1. Delete old avatar if exists
  const user = await User.findById(req.user.id);
  if (user.avatar) {
    const oldAvatarPath = path.join(__dirname, `${user.avatar}`);
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  // 2. Save new avatar path
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  user.avatar = avatarPath;
  await user.save();

  res.status(200).json({
    success: true,
    avatarUrl: avatarPath
  });
});
// Delete avatar
exports.deleteAvatar = catchAsyncError(async (req, res, next) => {
  await deleteOldAvatar(req.user.id);
  
  // Remove avatar reference from user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: '' },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Avatar removed successfully',
    user
  });
});

// Update user details
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const { name, phone, addresses } = req.body;
  
  // Basic validation
  if (!name) {
    return next(new ErrorHandler('Name is required', 400));
  }

  // Prepare update data
  const updateData = {
    name,
    phone
  };

  // Validate and update addresses if provided
  if (addresses) {
    const validatedAddresses = addresses.map(addr => {
      if (!addr.name || !addr.mobile || !addr.address || !addr.city || !addr.state || !addr.pincode) {
        throw new ErrorHandler('All address fields are required', 400);
      }
      return {
        name: addr.name,
        mobile: addr.mobile,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        locality: addr.locality || '',
        landmark: addr.landmark || '',
        alternatePhone: addr.alternatePhone || '',
        addressType: addr.addressType || 'home'
      };
    });

    updateData.addresses = validatedAddresses;
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { 
      new: true,
      runValidators: true
    }
  ).select('-password -resetPasswordToken -resetPasswordExpire');

  if (!updatedUser) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user: updatedUser
  });
});

// Get current user profile
exports.getMe = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpire');
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});