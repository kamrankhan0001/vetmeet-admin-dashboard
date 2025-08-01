// backend/models/Address.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: { // Firebase UID of the user this address belongs to
    type: String,
    required: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  houseNo: {
    type: String,
    required: true,
    trim: true,
  },
  roadName: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  townCity: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: { // Whether this is the user's default address
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

AddressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Address', AddressSchema);