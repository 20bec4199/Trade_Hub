const express = require('express');
const Router = express.Router();
const {
    getSellers,
    getSeller,
    createSeller,
    updateSeller,
    approveSeller,
    getSellerProducts,
    getSellerStats,

 } = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');

Router.route('/get').get(getSellers);
Router.route('/get/:id').get(getSeller);
Router.route('/create').post(protect, createSeller);
Router.route('/update/:id').put(updateSeller);
Router.route('/approve/:id').put(approveSeller);
Router.route('/get/products/:id').get(getSellerProducts);
Router.route('/get/stats/:id').get(getSellerStats);

module.exports = Router;