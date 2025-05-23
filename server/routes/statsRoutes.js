// server/routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin dashboard stats route
router.route('/').get(protect, authorize('admin'), getDashboardStats);

module.exports = router;