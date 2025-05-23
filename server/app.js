const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes')  
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
const errorMiddlewares = require('./middlewares/error');
const ProductRoutes = require('./routes/productRoutes');
app.use('/e_commerce',ProductRoutes);
app.use('/api/auth', userRoutes);
app.use(errorMiddlewares);

module.exports = app;
