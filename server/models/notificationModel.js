const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Please add a message'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: { 
    type: String, 
    enum: ['order', 'promotion', 'system', 'account'], 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  link: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for user notifications
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);