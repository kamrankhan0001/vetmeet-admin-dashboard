// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  tags: { // Array of strings for tags
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrls: {
    type: [String], // Array of strings for image URLs
    default: [],
  },
  brand: {
    type: String,
    trim: true,
  },
  status: { // e.g., 'active', 'inactive', 'discontinued'
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);