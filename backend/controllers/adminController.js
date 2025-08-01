// backend/controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Content = require('../models/Content');

// --- User Management ---
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin', 'vet', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// --- Product Management (Inventory) ---
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, category, tags, stock, imageUrls, brand, status } = req.body;

  if (!name || !price || !category || stock === undefined || stock === null) {
    return res.status(400).json({ message: 'Please provide all required product fields: name, price, category, stock.' });
  }
  if (price <= 0) {
    return res.status(400).json({ message: 'Price must be greater than 0.' });
  }
  if (stock < 0) {
    return res.status(400).json({ message: 'Stock cannot be negative.' });
  }

  try {
    const newProduct = new Product({
      name, description, price, category,
      tags: tags || [],
      stock,
      imageUrls: imageUrls || [],
      brand,
      status: status || 'active',
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, category, tags, stock, imageUrls, brand, status } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (tags !== undefined) product.tags = tags;
    if (stock !== undefined) product.stock = stock;
    if (imageUrls !== undefined) product.imageUrls = imageUrls;
    if (brand !== undefined) product.brand = brand;
    if (status !== undefined) product.status = status;

    if (product.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0.' });
    }
    if (product.stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative.' });
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Order Management ---
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'displayName email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status provided.' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Appointment Management ---
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid appointment status provided.' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.json({ message: `Appointment status updated to ${status}`, appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Coupon Management ---
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching all coupons:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, usageLimit, appliesTo, applicableItems, minOrderAmount } = req.body;

  if (!code || !discountType || !discountValue || !expiryDate || !usageLimit) {
    return res.status(400).json({ message: 'Please provide all required coupon fields.' });
  }
  if (appliesTo !== 'all' && (!applicableItems || applicableItems.length === 0)) {
    return res.status(400).json({ message: 'Applicable items are required for specific coupon types.' });
  }

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon with this code already exists.' });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      expiryDate: new Date(expiryDate),
      usageLimit,
      appliesTo,
      applicableItems: applicableItems || [],
      minOrderAmount: minOrderAmount || 0,
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  const { discountType, discountValue, expiryDate, usageLimit, appliesTo, applicableItems, minOrderAmount, isActive } = req.body;

  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (expiryDate !== undefined) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (appliesTo !== undefined) coupon.appliesTo = appliesTo;
    if (applicableItems !== undefined) coupon.applicableItems = applicableItems;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (isActive !== undefined) coupon.isActive = isActive;

    if (coupon.appliesTo !== 'all' && (!coupon.applicableItems || coupon.applicableItems.length === 0)) {
      return res.status(400).json({ message: 'Applicable items are required for specific coupon types.' });
    }

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Analytics Functions ---
const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalOrdersMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const salesResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" }
        }
      }
    ]);
    const totalSalesMonth = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    const newUsersMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({
      totalOrdersMonth,
      totalSalesMonth,
      newUsersMonth,
    });
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSalesByMonth = async (req, res) => {
  try {
    const monthsAgo = parseInt(req.query.monthsAgo) || 6;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - monthsAgo);
    startDate.setDate(1);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          name: {
            $dateToString: { format: "%b %Y", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }
          },
          sales: "$totalSales"
        }
      }
    ]);

    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales by month:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalUnitsSold: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          productName: { $first: "$items.productName" }
        }
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          name: "$productName",
          sales: "$totalSales",
          units: "$totalUnitsSold"
        }
      }
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAppointmentStats = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count"
        }
      }
    ]);

    const formattedStats = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    stats.forEach(s => {
      formattedStats[s.name] = s.value;
    });

    const appointmentsByStatusArray = Object.keys(formattedStats).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: formattedStats[key]
    }));

    res.json({
      ...formattedStats,
      statusBreakdown: appointmentsByStatusArray
    });

  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Review Management ---
const getAllReviews = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { comment: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
      ];
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'rejected'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid review status provided.' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    review.status = status;
    await review.save();
    res.json({ message: `Review status updated to ${status}`, review });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleAbusiveStatus = async (req, res) => {
  const { isAbusive } = req.body;

  if (typeof isAbusive !== 'boolean') {
    return res.status(400).json({ message: 'Invalid value for isAbusive provided.' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    review.isAbusive = isAbusive;
    await review.save();
    res.json({ message: `Review abusive status updated to ${isAbusive}`, review });
  } catch (error) {
    console.error("Error toggling abusive status:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- CMS Management ---
const getBanners = async (req, res) => {
  try {
    const banners = await Content.find({ contentType: 'banner' }).sort({ order: 1, createdAt: 1 });
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addBanner = async (req, res) => {
  const { title, subtitle, imageUrl, link, order } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ message: 'Title and Image URL are required for a banner.' });
  }
  try {
    const newBanner = new Content({
      contentType: 'banner',
      title, subtitle, imageUrl, link, order
    });
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBanner = async (req, res) => {
  const { title, subtitle, imageUrl, link, order, isActive } = req.body;
  try {
    const banner = await Content.findOneAndUpdate(
      { _id: req.params.id, contentType: 'banner' },
      { title, subtitle, imageUrl, link, order, isActive },
      { new: true, runValidators: true }
    );
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    res.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Content.findOneAndDelete({ _id: req.params.id, contentType: 'banner' });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    res.json({ message: 'Banner deleted successfully.' });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFaqs = async (req, res) => {
  try {
    const faqs = await Content.find({ contentType: 'faq' }).sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addFaq = async (req, res) => {
  const { question, answer, order } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and Answer are required for an FAQ.' });
  }
  try {
    const newFaq = new Content({
      contentType: 'faq',
      question, answer, order
    });
    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFaq = async (req, res) => {
  const { question, answer, order, isActive } = req.body;
  try {
    const faq = await Content.findOneAndUpdate(
      { _id: req.params.id, contentType: 'faq' },
      { question, answer, order, isActive },
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }
    res.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await Content.findOneAndDelete({ _id: req.params.id, contentType: 'faq' });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }
    res.json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAboutUsContent = async (req, res) => {
  try {
    const aboutUs = await Content.findOne({ contentType: 'aboutUs' });
    res.json(aboutUs || { contentType: 'aboutUs', content: '' });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAboutUsContent = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'About Us content cannot be empty.' });
  }
  try {
    const aboutUs = await Content.findOneAndUpdate(
      { contentType: 'aboutUs' },
      { contentType: 'aboutUs', content },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(aboutUs);
  } catch (error) {
    console.error("Error updating About Us content:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllAppointments,
  updateAppointmentStatus,
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getMonthlySummary,
  getSalesByMonth,
  getTopSellingProducts,
  getAppointmentStats,
  getAllReviews,
  updateReviewStatus,
  toggleAbusiveStatus,
  deleteReview,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
  getAboutUsContent,
  updateAboutUsContent,
};


