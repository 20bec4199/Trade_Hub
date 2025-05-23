const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product Name is required!'],
        trim:true,
        maxLength:[100,'Product Name cannot Exceed 100 characters!']
    },
    price:{
        type:Number,
        required:[true,'Product Price is required!'],
        default:0
    },
    description:{
        type:String,
        required:[true,'Product Description is required!'],
    },
    ratings:{
        type:String,
        default:0,
    },
    
    images:[
        {
            image:{
                type:String,
            },

        }
    ],
    category:{
        type:String,
        required:[true,"Please enter category of these product"],
    },
    seller:{
        type:String,
        required:[true,"Please enter product seller"],
    },
    stock:{
        type:Number,
        required:[true,"Please enter Product stock"],
    },
    numberOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating: {
                type:String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now(),
    }

},{collection: "product"});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;