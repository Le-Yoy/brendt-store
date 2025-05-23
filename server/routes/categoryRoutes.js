// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/categories - Get all categories with subcategories
router.get('/', async (req, res) => {
  try {
    const { gender } = req.query;
    
    // Build the match stage based on gender filter
    const matchStage = gender ? { gender } : {};
    
    // Aggregate categories with subcategories and counts
    const categories = await Product.aggregate([
      // Filter by gender if provided
      { $match: matchStage },
      
      // Group by category and subcategory
      {
        $group: {
          _id: {
            category: '$category',
            categoryName: '$categoryName',
            subcategory: '$subcategory',
            subcategoryName: '$subcategoryName',
            gender: '$gender'
          },
          count: { $sum: 1 }
        }
      },
      
      // Group by category to organize subcategories
      {
        $group: {
          _id: {
            category: '$_id.category',
            categoryName: '$_id.categoryName',
            gender: '$_id.gender'
          },
          subcategories: {
            $push: {
              subcategory: '$_id.subcategory',
              subcategoryName: '$_id.subcategoryName',
              count: '$count'
            }
          },
          count: { $sum: '$count' }
        }
      },
      
      // Format final output
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          categoryName: '$_id.categoryName',
          gender: '$_id.gender',
          count: '$count',
          subcategories: '$subcategories'
        }
      },
      
      // Sort by category name
      { $sort: { categoryName: 1 } }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in categories endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;