// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// Public routes for products (main website)
router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProductById);

module.exports = router;