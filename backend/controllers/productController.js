// backend/controllers/productController.js
const Product = require('../models/Product');

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Only fetch active products for the public view
    const products = await Product.find({ status: 'active' });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // Ensure product is active before returning
    const product = await Product.findOne({ _id: req.params.id, status: 'active' });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or is inactive' });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};