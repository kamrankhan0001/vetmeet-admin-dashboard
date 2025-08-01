// backend/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID of the user who submitted the review
    required: true,
    index: true,
  },
  userEmail: { // Storing user email for easier admin lookup
    type: String,
    trim: true,
  },
  productId: { // If the review is for a product
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false, // Can be null if it's a service review
  },
  productName: { // Storing product name for easier display
    type: String,
    trim: true,
  },
  serviceId: { // If the review is for a service (e.g., vet consultation)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // You might create a Service model later
    required: false, // Can be null if it's a product review
  },
  serviceName: { // Storing service name for easier display
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Reviews need to be approved by admin
    default: 'pending',
  },
  isAbusive: { // Flag for potentially abusive/spam reviews
    type: Boolean,
    default: false,
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

ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);