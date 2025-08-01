// backend/models/Content.js
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  contentType: { // e.g., 'banner', 'faq', 'aboutUs'
    type: String,
    required: true,
    enum: ['banner', 'faq', 'aboutUs'], // Define allowed content types
    index: true, // Good for querying by type
  },
  // Fields specific to 'banner'
  title: {
    type: String,
    trim: true,
    required: function() { return this.contentType === 'banner'; }
  },
  subtitle: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    required: function() { return this.contentType === 'banner'; }
  },
  link: {
    type: String,
    trim: true,
  },
  // Fields specific to 'faq'
  question: {
    type: String,
    trim: true,
    required: function() { return this.contentType === 'faq'; }
  },
  answer: {
    type: String,
    trim: true,
    required: function() { return this.contentType === 'faq'; }
  },
  // Fields specific to 'aboutUs'
  content: { // For About Us page, or other large text blocks
    type: String,
    trim: true,
    required: function() { return this.contentType === 'aboutUs'; }
  },
  // General fields
  order: { // For ordering banners/FAQs
    type: Number,
    default: 0,
  },
  isActive: {
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

// Add unique index for single-instance content types like 'aboutUs'
ContentSchema.index({ contentType: 1 }, { unique: true, partialFilterExpression: { contentType: 'aboutUs' } });

ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', ContentSchema);