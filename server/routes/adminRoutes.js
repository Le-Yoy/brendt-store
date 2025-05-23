// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.route('/stats').get(adminController.getDashboardStats);

// Analytics endpoints
router.route('/analytics/checkout').get(adminController.getCheckoutAnalytics);
router.route('/analytics/customer-insights').get(adminController.generateCustomerInsights);
router.route('/analytics/customers').get(adminController.generateCustomerInsights);

// Users management
router.route('/users')
  .get(adminController.getUsers)
  .post(adminController.createUser);

router.route('/users/:id')
  .get(adminController.getUserById)
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

// User role management
router.route('/promote/:id')
  .put(adminController.promoteToAdmin);

// Products management
router.route('/products')
  .get(adminController.getProducts)
  .post(adminController.createProduct);

router.route('/products/:id')
  .put(adminController.updateProduct)
  .delete(adminController.deleteProduct);

// NEW: Color management routes
router.route('/products/colors').get(adminController.getProductsWithColorDetails);
router.route('/products/color-stock').put(adminController.updateColorStock);
router.route('/products/color-price').put(adminController.updateColorPrice);
router.route('/products/color-stock-number').put(adminController.updateColorStockNumber);

// Categories management
router.route('/categories').get(adminController.getCategories);

// Orders management
router.route('/orders')
  .get(adminController.getOrders);

router.route('/orders/:id')
  .get(adminController.getOrderById);

router.route('/orders/:id/details')
  .get(adminController.getOrderWithDetails);

router.route('/orders/:id/timeline')
  .get(adminController.getOrderTimeline);

router.route('/orders/:id/status')
  .put(adminController.updateOrderStatus);

// Customer insights
router.route('/customers/:customerId/interactions')
  .get(adminController.getCustomerInteractions);

router.route('/customers/:customerId/orders')
  .get(adminController.getCustomerOrderHistory);

// Inventory management
router.route('/inventory')
  .get(adminController.getInventoryLogs)
  .post(adminController.createInventoryLog);

router.route('/inventory/:id/approve')
  .put(adminController.approveInventoryLog);

router.route('/inventory/:id/reject')
  .put(adminController.rejectInventoryLog);

module.exports = router;