const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const formController = require('../controllers/formController');

router.use(protect);

// GET all form submissions (Admins only)
router.get('/', authorize('admin'), formController.getFormSubmissions);

// Create a new form submission (public for customer-facing forms)
router.post('/', formController.createFormSubmission);

// Update a form submission (Admins process submissions)
router.put('/:id', authorize('admin'), formController.updateFormSubmission);

module.exports = router;
