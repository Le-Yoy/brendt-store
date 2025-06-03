// server/controllers/productController.js
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      gender,
      sort = 'newest',
      page = 1,
      limit = 12,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;

    // Special handling for subcategory discrepancies between menu and database
    if (subcategory) {
      if (gender === 'femme' && subcategory === 'mocassins') {
        // For women's mocassins, adjust to look for 'mocassinos' in DB
        filter.subcategory = 'mocassinos';
      } else if (gender === 'femme' && subcategory === 'babouches') {
        // For women's babouches, ensure correct filter
        filter.subcategory = 'babouches';
      } else {
        // For all other cases, use the subcategory as provided
        filter.subcategory = subcategory;
      }
    }

    if (gender) filter.gender = gender;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Filter query:', filter);
    console.log('Sort option:', sort);
    console.log('Page:', page, 'Limit:', limit);

    // Build sort object - ALWAYS put in-stock products first
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { inStock: -1, price: 1 };
        break;
      case 'price-desc':
        sortOption = { inStock: -1, price: -1 };
        break;
      case 'name-asc':
        sortOption = { inStock: -1, name: 1 };
        break;
      case 'name-desc':
        sortOption = { inStock: -1, name: -1 };
        break;
      case 'newest':
      default:
        sortOption = { inStock: -1, createdAt: -1 };
        break;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    // Debug info
    console.log(`Found ${products.length} products of ${totalProducts} total`);
    if (gender) {
      console.log(`Filtered by gender: ${gender}`);
    }

    res.status(200).json({
      data: products,
      totalProducts,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      limit: limitNum
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return next(new AppError('Error fetching products', 500));
  }
};

// All other methods remain unchanged below:
exports.debugProducts = async (req, res) => {
 try {
   // Check MongoDB connection
   const connectionStatus = mongoose.connection.readyState;
   const statusMap = {
     0: 'disconnected',
     1: 'connected',
     2: 'connecting',
     3: 'disconnecting'
   };
   
   // Get product count
   const count = await Product.countDocuments({});
   
   // Get database info
   const dbInfo = mongoose.connection.db ? {
     name: mongoose.connection.db.databaseName,
     collections: await mongoose.connection.db.listCollections().toArray()
   } : null;
   
   // Get model info
   const modelInfo = {
     name: Product.modelName,
     collection: Product.collection.name,
     schema: Object.keys(Product.schema.paths)
   };
   
   // Get a sample product
   const sampleProduct = count > 0 ? await Product.findOne({}) : null;
   
   res.json({
     connection: {
       status: statusMap[connectionStatus] || 'unknown',
       code: connectionStatus
     },
     database: dbInfo,
     model: modelInfo,
     products: {
       count,
       sample: sampleProduct
     }
   });
 } catch (error) {
   res.status(500).json({
     error: error.message,
     stack: process.env.NODE_ENV === 'production' ? null : error.stack
   });
 }
};

exports.getProductById = async (req, res, next) => {
 try {
   const id = req.params.id;
   console.log('Product ID requested:', id);
   console.log('ID type:', typeof id);
   
   let product;
   
   // Check if the ID is a valid MongoDB ObjectId
   if (mongoose.Types.ObjectId.isValid(id)) {
     console.log('Valid ObjectId format, searching by _id');
     product = await Product.findById(id);
   } else {
     // If not a valid ObjectId, try other approaches
     console.log('Not a valid ObjectId, trying alternative searches');
     
     // Try searching by custom fields - assuming you might have a numeric ID or slug
     product = await Product.findOne({ 
       $or: [
         { id: id }, // Added this to search by string ID
         { customId: id }, 
         { slug: id },
         { name: { $regex: new RegExp(id, 'i') } }
       ] 
     });
   }
   console.log('Product found:', product);
   
   if (!product) {
     console.log('Product not found with ID:', id);
     return next(new AppError('Product not found', 404));
   }
   
   res.status(200).json(product);
 } catch (error) {
   console.error('Error in getProductById:', error.message);
   return next(new AppError(`Error fetching product: ${error.message}`, 500));
 }
};

exports.createProduct = catchAsync(async (req, res, next) => {
 const product = await Product.create(req.body);
 res.status(201).json(product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
 const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: true
 });
 
 if (!product) {
   return next(new AppError('Product not found', 404));
 }
 
 res.status(200).json(product);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
 const product = await Product.findByIdAndDelete(req.params.id);
 
 if (!product) {
   return next(new AppError('Product not found', 404));
 }
 
 res.status(204).json(null);
});

exports.getCategories = async (req, res, next) => {
  try {
    console.log('Executing getCategories method');
    
    // Get gender filter from query if provided
    const { gender } = req.query;
    console.log('Gender filter for categories:', gender);
    
    // Always aggregate all categories first - simple approach without filtering by gender
    const categories = await Product.aggregate([
      // Group by category and subcategory
      {
        $group: {
          _id: {
            category: '$category',
            categoryName: '$categoryName',
            subcategory: '$subcategory',
            subcategoryName: '$subcategoryName'
          },
          count: { $sum: 1 }
        }
      },
      // Group by category to organize subcategories
      {
        $group: {
          _id: {
            category: '$_id.category',
            categoryName: '$_id.categoryName'
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
          count: '$count',
          subcategories: '$subcategories'
        }
      },
      // Sort by category name
      { $sort: { categoryName: 1 } }
    ]);

    console.log('Categories found:', categories.length);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in categories endpoint:', error);
    return next(new AppError('Error fetching categories', 500));
  }
};