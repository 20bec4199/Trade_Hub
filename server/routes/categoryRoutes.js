const express = require('express');
const Router = express.Router();
const { addCategory, createCategory } = require('../controllers/categoryController');

Router.route('/add').post(addCategory);
Router.route('/create').post(createCategory);

module.exports = Router;