const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrderById, 
  updateOrderToPaid, 
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { deductStockOnOrder, restoreStockOnCancel } = require('../middleware/stockMiddleware');

// Apply stock deduction middleware to order creation
router.route('/').post(optionalAuth, createOrder).get(protect, authorize('admin'), getAllOrders);

// Keep the rest unchanged
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);

// Add route for order cancellation with stock restoration
router.route('/:id/cancel').put(protect, authorize('admin'), restoreStockOnCancel, async (req, res) => {
  // Order cancellation logic here
  res.json({ status: 'success', message: 'Order cancelled and stock restored' });
});

module.exports = router;