const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.use(protect);

// GET notifications for current user
router.get('/', notificationController.getNotifications);

// Create a new notification (can be used by server-side events)
router.post('/', notificationController.createNotification);

// Mark a notification as read
router.put('/:id/read', notificationController.markNotificationAsRead);

module.exports = router;
