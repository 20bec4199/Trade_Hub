const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

exports.newProduct = catchAsyncError( async (req,res,next) => {
    console.log(req.body);
   
        const product = await Product.create(req.body);
        res.status(201)
           .json({success: true,message: 'Product created successfully', product});
   
    });

    
exports.getProducts = catchAsyncError( async (req,res,next) => {
    const resPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
     const product = await apiFeatures.query;
     res.status(200)
         .json({
            success:true,
            message:"Product fetched successfully!",
            count:product.length,
            product
         })
   
   
});

exports.getSingleProduct = catchAsyncError( async (req, res, next) => {
   
        const product = await Product.findById(req.params.id);
        if(!product) {
          return next(new ErrorHandler('Product not found', 404));
        }
                res.status(200)
                .json({
                    success: true,
                    message: 'Product fetched successfully',
                    product
                });

   
   
});

exports.updateProduct = catchAsyncError( async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
                });
                }
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200)
        .json({
            success: true,
            message: 'Product Updated successfully!',
            product
        });

    }
    catch(err) {
        res.status(500)
        .json({
          success:false,
          message:err.message
        });
  }
});

exports.deleteProduct = catchAsyncError( async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
                });
                }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200)
           .json({
            success: true,
            message: 'Product deleted successfully!'
           });
        }
        catch(err) {
            res.status(500)
               .json({
                success:false,
                message:err.message
               });
            }
        });