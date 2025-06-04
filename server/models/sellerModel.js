const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  businessName: { 
    type: String, 
    required: [true, 'Please add a business name'],
    trim: true
  },
  businessType: { 
    type: String, 
    required: [true, 'Please add a business type'],
    enum: ['individual', 'partnership', 'private_limited', 'public_limited']
  },
  GSTIN: { 
    type: String, 
    required: [true, 'Please add GSTIN'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: props => `${props.value} is not a valid GSTIN!`
    }
  },
  PAN: { 
    type: String, 
    required: [true, 'Please add PAN'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: props => `${props.value} is not a valid PAN!`
    }
  },
  bankDetails: {
    accountNumber: { 
      type: String, 
      required: [true, 'Please add account number'],
      validate: {
        validator: function(v) {
          return /^[0-9]{9,18}$/.test(v);
        },
        message: props => `${props.value} is not a valid account number!`
      }
    },
    IFSCCode: { 
      type: String, 
      required: [true, 'Please add IFSC code'],
      validate: {
        validator: function(v) {
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid IFSC code!`
      }
    },
    bankName: { 
      type: String, 
      required: [true, 'Please add bank name'] 
    }
  },
  rating: { 
    type: Number, 
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating can be at most 5']
  },
  totalSales: { 
    type: Number, 
    default: 0,
    min: [0, 'Total sales cannot be negative']
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

sellerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Seller', sellerSchema);