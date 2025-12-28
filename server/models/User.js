const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=random' },
  addresses: [{
    name: { type: String },
    mobile: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    locality: { type: String },
    type: { type: String, enum: ['home', 'work'], default: 'home' },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }],
  isApproved: { type: Boolean, default: false }, // for sellers
  isBlocked: { type: Boolean, default: false }, // for admin control
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
  resetToken: String,
  resetTokenExpiry: Date,
  otp: String,
  otpExpires: Date,
  hasSeenProfilePrompt: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
