// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { getUserOrders, getOrderById, createOrder, cancelOrder } = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');

// Routes for authenticated user's orders
router.route('/')
  .get(authenticate, getUserOrders)
  .post(authenticate, createOrder);

router.route('/:id')
  .get(authenticate, getOrderById);

router.route('/:id/cancel')
  .put(authenticate, cancelOrder);

module.exports = router;