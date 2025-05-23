// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Add direct MongoDB test route
router.get('/test', async (req, res) => {
    try {
      // Test direct MongoDB access
      const db = mongoose.connection.db;
      const collection = db.collection('products');
      const products = await collection.find({}).toArray();
      
      res.json({
        direct_count: products.length,
        samples: products.slice(0, 2)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); 

// Debug route - add this first for testing
router.get('/debug', productController.debugProducts);

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Protected routes - only for admin users
router.use(protect);
// Temporarily comment out restrictTo until properly defined
// router.use(restrictTo('admin'));

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;