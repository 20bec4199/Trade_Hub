const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: { 
    type: String, 
    required: true,
    enum: ['percentage', 'fixed'] 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: [0, 'Discount value must be at least 0']
  },
  minOrderValue: { 
    type: Number,
    min: [0, 'Minimum order value must be at least 0']
  },
  maxDiscount: { 
    type: Number,
    min: [0, 'Maximum discount must be at least 0']
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  usedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  usageLimit: { 
    type: Number,
    min: [0, 'Usage limit must be at least 0']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

// Validate that end date is in the future when coupon is active
couponSchema.pre('save', function(next) {
  if (this.isActive && this.endDate < new Date()) {
    this.isActive = false;
  }
  next();
});

// Index for active coupons
couponSchema.index({ code: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);