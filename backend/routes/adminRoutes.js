// backend/routes/adminRoutes.js
const express = require('express');
const {
  getAllUsers, getUserById, updateUserRole, deleteUser,
  getAllProducts, addProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus,
  getAllAppointments, updateAppointmentStatus,
  getAllCoupons, addCoupon, updateCoupon, deleteCoupon,
  getMonthlySummary, getSalesByMonth, getTopSellingProducts, getAppointmentStats,
  getAllReviews, updateReviewStatus, toggleAbusiveStatus, deleteReview,
  getBanners, addBanner, updateBanner, deleteBanner,
  getFaqs, addFaq, updateFaq, deleteFaq,
  getAboutUsContent, updateAboutUsContent,
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuthMiddleware'); // Admin-specific middleware

const router = express.Router();

// All routes defined after this line will require admin authentication
router.use(adminAuth);

// User Management
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product Management (Inventory)
router.route('/products')
  .get(getAllProducts)
  .post(addProduct);
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Appointment Management
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Coupon Management
router.route('/coupons')
  .get(getAllCoupons)
  .post(addCoupon);
router.route('/coupons/:id')
  .put(updateCoupon)
  .delete(deleteCoupon);

// Analytics Routes
router.get('/analytics/summary', getMonthlySummary);
router.get('/analytics/sales-by-month', getSalesByMonth);
router.get('/analytics/top-products', getTopSellingProducts);
router.get('/analytics/appointment-stats', getAppointmentStats);

// Review Management
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.put('/reviews/:id/abusive', toggleAbusiveStatus);
router.delete('/reviews/:id', deleteReview);

// CMS Management
router.route('/cms/banners')
  .get(getBanners)
  .post(addBanner);
router.route('/cms/banners/:id')
  .put(updateBanner)
  .delete(deleteBanner);

router.route('/cms/faqs')
  .get(getFaqs)
  .post(addFaq);
router.route('/cms/faqs/:id')
  .put(updateFaq)
  .delete(deleteFaq);

router.route('/cms/about-us')
  .get(getAboutUsContent)
  .put(updateAboutUsContent);

module.exports = router;

