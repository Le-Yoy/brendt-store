const InventoryLog = require('../models/InventoryLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all inventory logs (accessible to Admins and Warehouse Managers)
exports.getInventoryLogs = catchAsync(async (req, res, next) => {
  const logs = await InventoryLog.find().populate('product requestedBy approvedBy');
  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: { logs },
  });
});

// Create a new inventory log (Warehouse Manager creates a request)
exports.createInventoryLog = catchAsync(async (req, res, next) => {
  // req.body should include product, requestedQuantity, and requestedBy (from req.user)
  req.body.requestedBy = req.user._id;
  const log = await InventoryLog.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { log },
  });
});

// Approve an inventory log (Admin action)
exports.approveInventoryLog = catchAsync(async (req, res, next) => {
  const log = await InventoryLog.findById(req.params.id);
  if (!log) return next(new AppError('Inventory log not found', 404));

  log.status = 'approved';
  log.approvedBy = req.user._id;
  log.approvalComment = req.body.comment;
  await log.save();

  res.status(200).json({
    status: 'success',
    data: { log },
  });
});

// Reject an inventory log (Admin action)
exports.rejectInventoryLog = catchAsync(async (req, res, next) => {
  const log = await InventoryLog.findById(req.params.id);
  if (!log) return next(new AppError('Inventory log not found', 404));

  log.status = 'rejected';
  log.approvedBy = req.user._id;
  log.approvalComment = req.body.comment;
  await log.save();

  res.status(200).json({
    status: 'success',
    data: { log },
  });
});
