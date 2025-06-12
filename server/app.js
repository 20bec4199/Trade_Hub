const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes')  
const categoryRoutes = require('./routes/categoryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
const errorMiddlewares = require('./middlewares/error');
const ProductRoutes = require('./routes/productRoutes');
app.use('/e_commerce',ProductRoutes);
app.use('/api/auth', userRoutes);
app.use('/category',categoryRoutes);
app.use('/seller',sellerRoutes);
app.use(errorMiddlewares);

module.exports = app;
