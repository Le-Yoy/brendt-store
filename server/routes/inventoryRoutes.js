const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

// All routes below require authentication
router.use(protect);

// GET all inventory logs (Admins and Warehouse Managers)
router.get('/', authorize('admin', 'warehouse'), inventoryController.getInventoryLogs);

// Warehouse Manager creates an inventory request
router.post('/', authorize('warehouse'), inventoryController.createInventoryLog);

// Admin approves an inventory log
router.put('/:id/approve', authorize('admin'), inventoryController.approveInventoryLog);

// Admin rejects an inventory log
router.put('/:id/reject', authorize('admin'), inventoryController.rejectInventoryLog);

module.exports = router;
