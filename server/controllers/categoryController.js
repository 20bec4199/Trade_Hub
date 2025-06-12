const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middlewares/catchAsyncError');
const Product = require('../models/productModel');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()
    .sort('name')
    .populate('parentCategory', 'name slug');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate('parentCategory', 'name slug');

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  // Check if parent category exists if provided
  if (req.body.parentCategory) {
    const parent = await Category.findById(req.body.parentCategory);
    if (!parent) {
      return next(
        new ErrorResponse(`Parent category not found with id of ${req.body.parentCategory}`, 404)
      );
    }
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

exports.addCategory = asyncHandler (async (req, res, next) => {
 
    const categoryData = req.body;
    const category = await Category.create(categoryData);

    res.status(201).json({
        success:true,
        data: category
    });


});

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if trying to make a category its own parent
  if (req.body.parentCategory && req.body.parentCategory.toString() === req.params.id) {
    return next(
      new ErrorResponse(`Category cannot be its own parent`, 400)
    );
  }

  // Check if parent category exists if provided
  if (req.body.parentCategory) {
    const parent = await Category.findById(req.body.parentCategory);
    if (!parent) {
      return next(
        new ErrorResponse(`Parent category not found with id of ${req.body.parentCategory}`, 404)
      );
    }
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if category has products
  const products = await Product.findOne({ category: req.params.id });
  if (products) {
    return next(
      new ErrorResponse(`Cannot delete category with products`, 400)
    );
  }

  // Check if category has subcategories
  const subcategories = await Category.find({ parentCategory: req.params.id });
  if (subcategories.length > 0) {
    return next(
      new ErrorResponse(`Cannot delete category with subcategories`, 400)
    );
  }

  await category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get category hierarchy
// @route   GET /api/categories/hierarchy
// @access  Public
exports.getCategoryHierarchy = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()
    .sort('name')
    .populate('parentCategory', 'name slug');

  // Build hierarchy
  const buildHierarchy = (parentId = null) => {
    return categories
      .filter(cat => 
        (parentId === null && !cat.parentCategory) || 
        (cat.parentCategory && cat.parentCategory.toString() === parentId)
      )
      .map(cat => ({
        ...cat.toObject(),
        subcategories: buildHierarchy(cat._id.toString())
      }));
  };

  const hierarchy = buildHierarchy();

  res.status(200).json({
    success: true,
    data: hierarchy
  });
});

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
exports.getFeaturedCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isFeatured: true })
    .limit(10)
    .sort('name');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});