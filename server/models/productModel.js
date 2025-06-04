const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  discountedPrice: { 
    type: Number,
    validate: {
      validator: function(value) {
        return value < this.price;
      },
      message: 'Discounted price must be less than regular price'
    }
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  brand: { 
    type: String, 
    trim: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seller', 
    required: true 
  },
  images: [{ 
    type: String, 
    required: [true, 'Please add at least one image'] 
  }],
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  attributes: {
    color: { type: String },
    size: { type: String },
    weight: { type: String },
    // Add other product-specific attributes as needed
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating can be at most 5']
  },
  totalReviews: { 
    type: Number, 
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['active', 'out_of_stock', 'discontinued'], 
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text' 
});

module.exports = mongoose.model('Product', productSchema);