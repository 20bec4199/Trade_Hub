const Seller = require('../models/sellerModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middlewares/catchAsyncError');
const Product = require('../models/productModel');

// @desc    Get all sellers (Admin only)
// @route   GET /api/sellers
// @access  Private/Admin
exports.getSellers = asyncHandler(async (req, res, next) => {
  const sellers = await Seller.find()
    .populate('userId', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers
  });
});

// @desc    Get single seller
// @route   GET /api/sellers/:id
// @access  Public
exports.getSeller = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id)
    .populate('userId', 'name email avatar phone')
    .populate({
      path: 'products',
      select: 'name price discountedPrice images averageRating'
    });

  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Create seller profile (User becomes Seller)
// @route   POST /api/sellers
// @access  Private
exports.createSeller = asyncHandler(async (req, res, next) => {
  // Check if user already has a seller profile
  const existingSeller = await Seller.findOne({ userId: req.user.id });
  if (existingSeller) {
    return next(
      new ErrorResponse(`User already has a seller profile`, 400)
    );
  }

  // Add user to request body
  req.body.userId = req.user.id;

  // Create seller
  const seller = await Seller.create(req.body);
  console.log(Seller);

  // Update user role to seller
  await User.findByIdAndUpdate(req.user.id, { 
    role: 'seller',
    sellerProfile: seller._id
  });

  res.status(201).json({
    success: true,
    data: seller
  });
});

// @desc    Update seller profile
// @route   PUT /api/sellers/:id
// @access  Private/Seller
exports.updateSeller = asyncHandler(async (req, res, next) => {
  let seller = await Seller.findById(req.params.id);

  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is seller owner or admin
  if (seller.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this seller`, 401)
    );
  }

  seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Approve seller (Admin only)
// @route   PUT /api/sellers/:id/approve
// @access  Private/Admin
exports.approveSeller = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true, runValidators: true }
  );

  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Get seller's products
// @route   GET /api/sellers/:id/products
// @access  Public
exports.getSellerProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ seller: req.params.id })
    .select('name price discountedPrice images averageRating stock')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get seller statistics
// @route   GET /api/sellers/:id/stats
// @access  Private/Seller
exports.getSellerStats = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);
  
  
  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is seller owner or admin
  if (seller.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to view these stats`, 401)
    );
  }

  const stats = await Product.aggregate([
    {
      $match: { seller: seller._id }
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        averageRating: { $avg: '$averageRating' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalSales: seller.totalSales,
      rating: seller.rating,
      ...(stats[0] || { totalProducts: 0, totalStock: 0, averageRating: 0 })
    }
  });
});