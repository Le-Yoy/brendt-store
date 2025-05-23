const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getUserStats,
  // verifyEmail, // Uncomment if you implement email verification
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
// router.route('/verify/:token').get(verifyEmail); // Uncomment if you implement email verification

// Protected routes
router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/address').post(protect, addShippingAddress);
router.route('/address/:addressId').put(protect, updateShippingAddress).delete(protect, deleteShippingAddress);
router.route('/stats').get(protect, getUserStats);
// router.route('/promote/:id').put(protect, setAdmin);


module.exports = router;