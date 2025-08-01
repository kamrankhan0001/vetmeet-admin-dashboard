// backend/models/Coupon.js
const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  usageLimit: { // Total number of times this coupon can be used
    type: Number,
    required: true,
    min: 1,
  },
  currentUsage: { // How many times it has been used so far
    type: Number,
    default: 0,
    min: 0,
  },
  appliesTo: {
    type: String,
    enum: ['all', 'categories', 'products'],
    default: 'all',
  },
  applicableItems: { // Array of product or category IDs (strings)
    type: [String],
    default: [],
  },
  minOrderAmount: { // Minimum order total for coupon to be valid
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: { // Can be manually deactivated by admin
    type: Boolean,
    default: true,
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

// Add a virtual property to check if the coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Ensure 'updatedAt' is updated on every save
CouponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Coupon', CouponSchema);