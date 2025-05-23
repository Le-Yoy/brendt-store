const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get notifications for the current user
exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: { notifications },
  });
});

// Create a notification (can be called from various backend events)
exports.createNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { notification },
  });
});

// Mark a notification as read
exports.markNotificationAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(new AppError('Notification not found', 404));
  notification.read = true;
  await notification.save();
  res.status(200).json({
    status: 'success',
    data: { notification },
  });
});
