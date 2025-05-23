const express = require('express');

const app = require('./app');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDatabase = require('./config/database');
dotenv.config({path:path.join(__dirname,"config/.env")});



connectDatabase();
require('./config/oauth');
const server = app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error ${err.message}`);
    console.log('Shutting down the server due to uncaugth exception error');
    server.close(() => {
        process.exit(1);
    })
});

