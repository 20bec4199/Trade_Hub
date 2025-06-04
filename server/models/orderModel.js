const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be at least 0']
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seller', 
    required: true 
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  shippingAddress: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['cod', 'credit_card', 'debit_card', 'net_banking', 'upi', 'wallet']
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'], 
    default: 'processing' 
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: [0, 'Total amount must be at least 0']
  },
  taxAmount: { 
    type: Number, 
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  shippingFee: { 
    type: Number, 
    default: 0,
    min: [0, 'Shipping fee cannot be negative']
  },
  discountAmount: { 
    type: Number, 
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  trackingNumber: { type: String },
  deliveryDate: { type: Date },
  couponApplied: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { type: Date }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isNew) {
    const itemsTotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totalAmount = itemsTotal + this.taxAmount + this.shippingFee - this.discountAmount;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);