// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID of the user who placed the order
    required: true,
    index: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: String, // Snapshot name at time of order
      productImage: String, // Snapshot image at time of order
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: { // Price at the time of order
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingAddress: { // Embedded address details
    fullName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    emailId: { type: String, required: true },
    houseNo: { type: String, required: true },
    roadName: { type: String, required: true },
    landmark: { type: String },
    pincode: { type: String, required: true },
    townCity: { type: String, required: true },
    state: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'UPI', 'NetBanking'], // Example payment methods
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  status: { // Order status (e.g., pending, processing, shipped, delivered, cancelled)
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  paymentId: { // Transaction ID from payment gateway
    type: String,
  },
  deliveryDate: {
    type: Date,
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

OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);