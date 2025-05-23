const FormSubmission = require('../models/FormSubmission');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all form submissions (Admin only)
exports.getFormSubmissions = catchAsync(async (req, res, next) => {
  const forms = await FormSubmission.find();
  res.status(200).json({
    status: 'success',
    results: forms.length,
    data: { forms },
  });
});

// Create a new form submission (Customer-facing forms are public)
exports.createFormSubmission = catchAsync(async (req, res, next) => {
  const form = await FormSubmission.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { form },
  });
});

// Update a form submission (for processing internal forms)
exports.updateFormSubmission = catchAsync(async (req, res, next) => {
  const form = await FormSubmission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!form) return next(new AppError('Form submission not found', 404));
  res.status(200).json({
    status: 'success',
    data: { form },
  });
});
