const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const { registerUser } = require('./authController');

exports.updateUserDetails = catchAsyncError( async (req, res, next) => {
    const user = req.user;
    const updatedData = req.body;
    console.log(req.body);
    console.log(req.user);
    const response = await User.findOneAndUpdate({email: user.email}, {$set: updatedData}, { new: true});
    if(!response){
      return next ( new ErrorHandler('User not found!', 404)); 
    }



    res.status(200)
    .json({
        success: true,
        user: response
    });
})
