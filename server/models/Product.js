const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String },
  condition: { type: String, enum: ['new', 'used', 'refurbished'], default: 'new' },
  images: [{ type: String }], // array of image URLs
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  bidCount: { type: Number, default: 0 },
  minimumIncrement: { type: Number, required: true, default: 1 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended', 'sold'], default: 'active' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  brand: { type: String, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
