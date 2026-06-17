// server/routes/atelierRoutes.js
// Endpoints for the atelier operator (Simo) — also usable by admin.
// Simo can: list orders, advance order status (confirm → prepare → ship),
// add notes, and view stock. He cannot cancel/deliver, see analytics,
// manage users, or change prices/products (those stay admin-only).
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const AppError = require('../utils/appError');

router.use(protect);
router.use(authorize('admin', 'atelier'));

// Restrict the status transitions an atelier user may perform.
// Admins (who also use admin routes) are unrestricted here.
const ATELIER_ALLOWED_STATUSES = ['processing', 'packed', 'shipped'];
const restrictAtelierStatus = (req, res, next) => {
  if (req.user.role === 'atelier' && !ATELIER_ALLOWED_STATUSES.includes(req.body.status)) {
    return next(new AppError("Vous n'êtes pas autorisé à appliquer ce statut.", 403));
  }
  next();
};

router.route('/orders').get(adminController.getOrders);
router.route('/orders/:id/status').put(restrictAtelierStatus, adminController.updateOrderStatus);

// Read-only stock view (per-color details) for the "stock à fabriquer" list.
router.route('/products').get(adminController.getProductsWithColorDetails);

module.exports = router;
