const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required!"]
    },
    email:{
        type: String,
        required: [true,"Email is required!"],
        unique: true,
        validate: [validator.isEmail,"Please enter valid Email!"],
    },
    password:{
        type: String,
        required: [true,'Password is required!']
    },
    avatar: {
        type: String,
        default: 'https://i.ibb.co/4pDNDk1/avatar.png',
      },
      googleId: {
        type: String,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      role: {
        type: String,
        default: 'User',
      },
      resetPasswordToken: {
          type: String,
      },
      resetPasswordTokenExpire: {
          type: Date
      },
      createdAt:{
          type:Date,
          default:Date.now
      }
    },
    {
      timestamps: true,
    },
   
{collection:'user'});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });

const User = mongoose.model('user',userSchema);
module.exports = User;