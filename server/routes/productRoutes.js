const express = require('express');
const Router = express.Router();
const {newProduct,getProducts,getSingleProduct,updateProduct,deleteProduct} = require('../controllers/productController');


Router.route('/add/product').post(newProduct);
Router.route('/get/products').get(getProducts);
Router.route('/product/:id')
                            .get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct);

module.exports = Router;
