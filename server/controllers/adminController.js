// server/controllers/adminController.js
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const InventoryLog = require('../models/InventoryLog');
const FormSubmission = require('../models/FormSubmission');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

// Function to promote a user to admin role
const promoteToAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  user.role = 'admin';
  await user.save();
  
  res.status(200).json({
    status: 'success',
    message: 'User promoted to admin successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

// Get all users (admin only)
const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select('-password');
  
  res.status(200).json({
    status: 'success',
    data: users
  });
});

// Create a new user (admin only)
const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  
  // Remove password from response
  newUser.password = undefined;
  
  res.status(201).json({
    status: 'success',
    data: newUser
  });
});

// Get specific user by ID (admin only)
const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: user
  });
});

// Update user (admin only)
const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Prevent password updates through this endpoint
  if (req.body.password) {
    delete req.body.password;
  }
  
  // Update user fields
  Object.keys(req.body).forEach(key => {
    user[key] = req.body[key];
  });
  
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: user
  });
});

// Delete user (admin only)
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  await User.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
});

// Get all products (admin only)
const getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});
  
  res.status(200).json({
    status: 'success',
    data: products
  });
});

// Create a new product (admin only)
const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: newProduct
  });
});

// Update product (admin only)
const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  // Update product fields
  Object.keys(req.body).forEach(key => {
    product[key] = req.body[key];
  });
  
  await product.save();
  
  res.status(200).json({
    status: 'success',
    data: product
  });
});

// Delete product (admin only)
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  await Product.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});

// Get all categories (admin only)
const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({});
  
  res.status(200).json({
    status: 'success',
    data: categories
  });
});

// Get all orders (admin only)
const getOrders = catchAsync(async (req, res, next) => {
  // Remove any mock data and use real database query
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders in database`);
    
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return next(new AppError('Error fetching orders', 500));
  }
});

// Make sure this function exists and works
const getOrderById = catchAsync(async (req, res, next) => {
  // Simple implementation for testing
  res.status(200).json({
    status: 'success',
    data: {
      _id: req.params.id,
      createdAt: new Date(),
      user: {
        _id: '123456789012',
        name: 'Test User',
        email: 'test@example.com'
      },
      orderItems: [
        {
          name: 'Product 1',
          price: 1000,
          quantity: 1
        }
      ],
      totalPrice: 1000,
      isPaid: true,
      paidAt: new Date(),
      isShipped: false,
      isDelivered: false,
      paymentMethod: 'card'
    }
  });
});

// Get order with detailed information (admin only)
const getOrderWithDetails = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone createdAt')
    .populate({
      path: 'orderItems.product',
      select: 'name category price images'
    });
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: order
  });
});

// Get order timeline events (admin only)
const getOrderTimeline = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  
  // Build timeline from order data
  const timeline = [];
  
  // Add creation event
  timeline.push({
    type: 'order_created',
    title: 'Commande créée',
    description: 'La commande a été passée par le client',
    timestamp: order.createdAt,
    status: 'complete'
  });
  
  // Add payment event if paid
  if (order.isPaid) {
    timeline.push({
      type: 'payment_confirmed',
      title: 'Paiement confirmé',
      description: 'Le paiement a été reçu et confirmé',
      timestamp: order.paidAt,
      status: 'complete'
    });
  }
  
  // Add order processing event
  if (order.isPaid) {
    timeline.push({
      type: 'order_processing',
      title: 'Commande en traitement',
      description: 'La commande est en cours de préparation',
      timestamp: order.paidAt ? new Date(new Date(order.paidAt).getTime() + 3600000) : null, // 1 hour after payment
      status: 'complete'
    });
  }
  
  // Add packing event if shipped
  if (order.isShipped) {
    timeline.push({
      type: 'order_packed',
      title: 'Commande emballée',
      description: 'La commande a été emballée et est prête pour l\'expédition',
      timestamp: order.shippedAt ? new Date(new Date(order.shippedAt).getTime() - 7200000) : null, // 2 hours before shipping
      status: 'complete'
    });
  }
  
  // Add shipping event if shipped
  if (order.isShipped) {
    timeline.push({
      type: 'order_shipped',
      title: 'Commande expédiée',
      description: 'La commande a été remise au transporteur',
      timestamp: order.shippedAt,
      status: 'complete'
    });
  }
  
  // Add delivery event if delivered
  if (order.isDelivered) {
    timeline.push({
      type: 'order_delivered',
      title: 'Commande livrée',
      description: 'La commande a été livrée au client',
      timestamp: order.deliveredAt,
      status: 'complete'
    });
  }
  
  // Sort timeline by timestamp
  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  res.status(200).json({
    status: 'success',
    data: timeline
  });
});

// Add this to your adminController.js file, alongside other exported controller functions:
// Update order status (admin only)
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  if (!status) {
    return next(new AppError('Status is required', 400));
  }

  // Cancel requires a reason
  if (status === 'cancelled' && !note) {
    return next(new AppError('A reason is required for cancellation', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Update order status fields
  switch (status) {
    case 'processing':
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = Date.now();
      order.isProcessing = true;
      if (!order.processingAt) order.processingAt = Date.now();
      break;
    case 'shipped':
      order.isShipped = true;
      order.shippedAt = Date.now();
      break;
    case 'delivered':
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      break;
    case 'cancelled':
      order.isCancelled = true;
      order.cancelledAt = Date.now();
      order.cancelReason = note;
      break;
    default:
      return next(new AppError('Invalid status', 400));
  }

  // Add to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  
  order.statusHistory.push({
    status,
    timestamp: Date.now(),
    updatedBy: req.user._id,
    note
  });

  // Add to admin notes if a note was provided
  if (note) {
    if (!order.adminNotes) {
      order.adminNotes = [];
    }
    
    order.adminNotes.push({
      text: note,
      addedBy: req.user._id,
      addedAt: Date.now()
    });
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// Get customer interactions (admin only)
const getCustomerInteractions = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;
  
  // Validate customer exists
  const customer = await User.findById(customerId);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  
  // Get form submissions as proxy for interactions
  const formSubmissions = await FormSubmission.find({ 
    'data.userId': mongoose.Types.ObjectId(customerId) 
  }).sort({ createdAt: -1 });
  
  // Transform form submissions into interaction-like data
  const interactions = formSubmissions.map(submission => {
    let interactionType, details;
    
    switch(submission.type) {
      case 'contact':
        interactionType = 'support_contact';
        details = {
          subject: submission.data.subject || 'Contact général',
          channel: 'Formulaire web'
        };
        break;
      case 'newsletter':
        interactionType = 'newsletter_signup';
        details = {
          interests: submission.data.interests || []
        };
        break;
      case 'checkout':
        interactionType = submission.data.completed ? 'checkout_complete' : 'checkout_start';
        details = {
          cartItems: submission.data.itemCount || 0,
          cartTotal: submission.data.total || 0
        };
        break;
      default:
        interactionType = 'form_submission';
        details = submission.data;
    }
    
    return {
      type: interactionType,
      timestamp: submission.createdAt,
      details
    };
  });
  
  // Create mock product views - in a real system, these would come from analytics data
  // Add some simulated product views based on order history
  const orders = await Order.find({ user: customerId }).populate('orderItems.product');
  const productViews = [];
  
  if (orders && orders.length > 0) {
    // Extract all ordered products
    const orderedProducts = orders.flatMap(order => order.orderItems);
    
    // Add some simulated product views
    for (const item of orderedProducts.slice(0, 5)) {
      if (item.product) {
        productViews.push({
          type: 'product_view',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random time in last 30 days
          details: {
            productId: item.product._id,
            productName: item.product.name,
            duration: Math.floor(Math.random() * 180) + 30 // Random duration between 30-210 seconds
          }
        });
      }
    }
  }
  
  // Add a couple of search interactions
  const searches = [
    {
      type: 'search',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000), // Random time in last 14 days
      details: {
        query: 'chaussures derby',
        resultsCount: 8
      }
    },
    {
      type: 'search',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000), // Random time in last 7 days
      details: {
        query: 'bottines cuir',
        resultsCount: 5
      }
    }
  ];
  
  // Combine all interaction types
  const allInteractions = [...interactions, ...productViews, ...searches];
  
  // Sort by timestamp (newest first)
  allInteractions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.status(200).json({
    status: 'success',
    data: allInteractions
  });
});

// Get customer order history with insights (admin only)
const getCustomerOrderHistory = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;

  // Validate customer exists
  const customer = await User.findById(customerId);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  // Get all orders for customer
  const orders = await Order.find({ user: customerId })
    .sort({ createdAt: -1 });

  // Calculate customer metrics
  const totalSpent = orders.reduce((sum, order) => {
    return sum + (order.isPaid ? order.totalPrice : 0);
  }, 0);

  const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

  // Get preferred categories
  const categoryPreferences = await Order.aggregate([
    { $match: { user: mongoose.Types.ObjectId(customerId) } },
    { $unwind: '$orderItems' },
    { $lookup: {
      from: 'products',
      localField: 'orderItems.product',
      foreignField: '_id',
      as: 'productData'
    }},
    { $unwind: '$productData' },
    { $group: {
      _id: '$productData.category',
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      customer,
      orders,
      metrics: {
        totalOrders: orders.length,
        totalSpent,
        avgOrderValue
      },
      preferences: categoryPreferences
    }
  });
});

// Get checkout form submission analytics (admin only)
const getCheckoutAnalytics = catchAsync(async (req, res, next) => {
  const { period = '30d' } = req.query;
  
  // Calculate date range based on period
  const currentDate = new Date();
  let startDate;
  
  if (period === '7d') {
    startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === '30d') {
    startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === '90d') {
    startDate = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else {
    startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30d
  }
  
  // Get checkout form submissions for the period
  const checkoutSubmissions = await FormSubmission.find({
    type: 'checkout',
    createdAt: { $gte: startDate }
  });
  
  // Calculate metrics
  const totalSubmissions = checkoutSubmissions.length;
  const completedSubmissions = checkoutSubmissions.filter(sub => sub.data?.completed).length;
  
  // Calculate conversion rate
  const conversionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;
  
  // Calculate average completion time (if available in data)
  let totalCompletionTime = 0;
  let completionTimeCount = 0;
  
  checkoutSubmissions.forEach(sub => {
    if (sub.data?.completionTime && sub.data.completed) {
      totalCompletionTime += sub.data.completionTime;
      completionTimeCount++;
    }
  });
  
  const averageCompletionTime = completionTimeCount > 0 ? totalCompletionTime / completionTimeCount : 0;
  
  // Calculate abandonment points
  const abandonmentPoints = [];
  const abandonmentSteps = ['personal_info', 'shipping_address', 'payment_method', 'review_order'];
  const abandonmentLabels = {
    'personal_info': 'Informations personnelles',
    'shipping_address': 'Adresse de livraison',
    'payment_method': 'Méthode de paiement',
    'review_order': 'Récapitulatif'
  };
  
  // Count abandonments by last completed step
  abandonmentSteps.forEach(step => {
    const count = checkoutSubmissions.filter(sub => !sub.data?.completed && sub.data?.lastCompletedStep === step).length;
    if (count > 0 || abandonmentPoints.length > 0) { // Include zero counts after first non-zero
      abandonmentPoints.push({
        step,
        label: abandonmentLabels[step] || step,
        count
      });
    }
  });
  
  // Payment method distribution
  const paymentMethodDistribution = [];
  const paymentMethods = ['card', 'cash', 'transfer'];
  const paymentLabels = {
    'card': 'Carte bancaire',
    'cash': 'Paiement à la livraison',
    'transfer': 'Virement bancaire'
  };
  
  paymentMethods.forEach(method => {
    const count = checkoutSubmissions.filter(sub => sub.data?.completed && sub.data?.paymentMethod === method).length;
    paymentMethodDistribution.push({
      method,
      label: paymentLabels[method] || method,
      count
    });
  });
  
  // Device breakdown
  const deviceBreakdown = [];
  const devices = ['mobile', 'desktop', 'tablet'];
  const deviceLabels = {
    'mobile': 'Mobile',
    'desktop': 'Desktop',
    'tablet': 'Tablette'
  };
  
  devices.forEach(device => {
    const count = checkoutSubmissions.filter(sub => sub.data?.device === device).length;
    deviceBreakdown.push({
      device,
      label: deviceLabels[device] || device,
      count
    });
  });
  
  // Get trend data by comparing to previous period
  let conversionRateTrend = 0;
  let completionTimeTrend = 0;
  
  // Calculate previous period start date
  const previousPeriodStart = new Date(startDate.getTime() - (currentDate.getTime() - startDate.getTime()));
  
  // Get previous period data
  const previousPeriodSubmissions = await FormSubmission.find({
    type: 'checkout',
    createdAt: { $gte: previousPeriodStart, $lt: startDate }
  });
  
  // Calculate previous period metrics
  const previousTotalSubmissions = previousPeriodSubmissions.length;
  const previousCompletedSubmissions = previousPeriodSubmissions.filter(sub => sub.data?.completed).length;
  
  // Calculate previous period conversion rate
  const previousConversionRate = previousTotalSubmissions > 0 ? (previousCompletedSubmissions / previousTotalSubmissions) * 100 : 0;
  
  // Calculate previous period average completion time
  let previousTotalCompletionTime = 0;
  let previousCompletionTimeCount = 0;
  
  previousPeriodSubmissions.forEach(sub => {
    if (sub.data?.completionTime && sub.data.completed) {
      previousTotalCompletionTime += sub.data.completionTime;
      previousCompletionTimeCount++;
    }
  });
  
  const previousAverageCompletionTime = previousCompletionTimeCount > 0 ? previousTotalCompletionTime / previousCompletionTimeCount : 0;
  
  // Calculate trends
  if (previousConversionRate > 0) {
    conversionRateTrend = conversionRate - previousConversionRate;
  }
  
  if (previousAverageCompletionTime > 0) {
    completionTimeTrend = averageCompletionTime - previousAverageCompletionTime;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      conversionRate,
      conversionRateTrend,
      averageCompletionTime,
      completionTimeTrend,
      abandonmentPoints,
      paymentMethodDistribution,
      deviceBreakdown
    }
  });
});

// Get inventory logs (admin only)
const getInventoryLogs = catchAsync(async (req, res, next) => {
  const inventoryLogs = await InventoryLog.find({})
    .populate('product', 'name')
    .populate('requestedBy', 'name')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    data: inventoryLogs
  });
});

// Create inventory log (admin only)
const createInventoryLog = catchAsync(async (req, res, next) => {
  const newLog = await InventoryLog.create({
    ...req.body,
    requestedBy: req.user._id
  });
  
  res.status(201).json({
    status: 'success',
    data: newLog
  });
});

// Approve inventory log (admin only)
const approveInventoryLog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  
  const inventoryLog = await InventoryLog.findById(id);
  
  if (!inventoryLog) {
    return next(new AppError('Inventory log not found', 404));
  }
  
  // Update inventory log status
  inventoryLog.status = 'approved';
  inventoryLog.comment = comment || '';
  inventoryLog.approvedBy = req.user._id;
  inventoryLog.approvedAt = Date.now();
  
  await inventoryLog.save();
  
  // Update the actual product inventory
  const product = await Product.findById(inventoryLog.productId);
  
  if (product) {
    // Update product inventory based on log type
    if (inventoryLog.action === 'add') {
      // Find the specific variant to update
      const variant = product.variants.find(v => v._id.toString() === inventoryLog.variantId);
      if (variant) {
        variant.inventory += inventoryLog.quantity;
      }
    } else if (inventoryLog.action === 'remove') {
      // Find the specific variant to update
      const variant = product.variants.find(v => v._id.toString() === inventoryLog.variantId);
      if (variant) {
        variant.inventory = Math.max(0, variant.inventory - inventoryLog.quantity);
      }
    }
    
    await product.save();
  }
  
  res.status(200).json({
    status: 'success',
    data: inventoryLog
  });
});

// Reject inventory log (admin only)
const rejectInventoryLog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  
  const inventoryLog = await InventoryLog.findById(id);
  
  if (!inventoryLog) {
    return next(new AppError('Inventory log not found', 404));
  }
  
  // Update inventory log status
  inventoryLog.status = 'rejected';
  inventoryLog.comment = comment || '';
  inventoryLog.rejectedBy = req.user._id;
  inventoryLog.rejectedAt = Date.now();
  
  await inventoryLog.save();
  
  res.status(200).json({
    status: 'success',
    data: inventoryLog
  });
});

// Generate customer insights for all customers
const generateCustomerInsights = catchAsync(async (req, res, next) => {
  // Get purchase frequency distribution
  const purchaseFrequency = await Order.aggregate([
    { $group: {
      _id: '$user',
      orderCount: { $sum: 1 },
      firstPurchase: { $min: '$createdAt' },
      lastPurchase: { $max: '$createdAt' },
      totalSpent: { $sum: '$totalPrice' }
    }},
    { $project: {
      _id: 1,
      orderCount: 1,
      daysSinceFirstPurchase: {
        $divide: [
          { $subtract: [new Date(), '$firstPurchase'] },
          1000 * 60 * 60 * 24 // Convert ms to days
        ]
      },
      daysBetweenPurchases: {
        $cond: {
          if: { $gt: ['$orderCount', 1] },
          then: {
            $divide: [
              { $subtract: ['$lastPurchase', '$firstPurchase'] },
              { $multiply: [1000 * 60 * 60 * 24, { $subtract: ['$orderCount', 1] }] }
            ]
          },
          else: null
        }
      },
      averageOrderValue: { $divide: ['$totalSpent', '$orderCount'] }
    }},
    { $group: {
      _id: null,
      totalCustomers: { $sum: 1 },
      averagePurchaseFrequency: { $avg: '$daysBetweenPurchases' },
      averageOrderValue: { $avg: '$averageOrderValue' },
      frequencyDistribution: {
        $push: {
          customerId: '$_id',
          orderCount: '$orderCount',
          daysBetweenPurchases: '$daysBetweenPurchases'
        }
      }
    }}
  ]);

  // Get product category affinity
  const categoryAffinity = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $lookup: {
      from: 'products',
      localField: 'orderItems.product',
      foreignField: '_id',
      as: 'productData'
    }},
    { $unwind: '$productData' },
    { $group: {
      _id: {
        user: '$user',
        category: '$productData.category'
      },
      purchaseCount: { $sum: 1 }
    }},
    { $sort: { purchaseCount: -1 } },
    { $group: {
      _id: '$_id.user',
      categories: {
        $push: {
          category: '$_id.category',
          count: '$purchaseCount'
        }
      }
    }}
  ]);

  // Identify high-value customers
  const highValueCustomers = await Order.aggregate([
    { $group: {
      _id: '$user',
      totalSpent: { $sum: '$totalPrice' },
      orderCount: { $sum: 1 }
    }},
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userData'
    }},
    { $unwind: '$userData' },
    { $project: {
      _id: 1,
      name: '$userData.name',
      email: '$userData.email',
      totalSpent: 1,
      orderCount: 1,
      averageOrderValue: { $divide: ['$totalSpent', '$orderCount'] }
    }},
    { $sort: { totalSpent: -1 } },
    { $limit: 20 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      purchaseFrequency: purchaseFrequency[0] || {},
      categoryAffinity,
      highValueCustomers
    }
  });
});

const getDashboardStats = catchAsync(async (req, res, next) => {
  // Validate the user is an admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Not authorized as admin', 403));
  }
  
  // Get total orders count
  const ordersCount = await Order.countDocuments();
  
  // Get total sales amount
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
  ]);
  const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
  
  // Get average order value
  const averageOrderValue = ordersCount > 0 ? totalSales / ordersCount : 0;
  
  // Get total customers count
  const totalCustomers = await User.countDocuments({ role: 'user' });
  
  // Get sales by period (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const salesByPeriod = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isPaid: true } },
    {
      $group: {
        _id: { 
          year: { $year: "$createdAt" }, 
          month: { $month: "$createdAt" } 
        },
        sales: { $sum: "$totalPrice" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        period: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
              { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
              { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
              { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
              { case: { $eq: ["$_id.month", 5] }, then: "May" },
              { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
              { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
              { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
              { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
              { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
              { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
              { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
            ]
          }
        },
        sales: 1
      }
    }
  ]);
  
  // Get top selling products
  const topSellingProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        sales: { $sum: "$orderItems.quantity" },
        revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
      }
    },
    { $sort: { sales: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: 1,
        sales: 1,
        revenue: 1
      }
    }
  ]);
  
  // Calculate sales growth (comparing current month to previous month)
  const currentMonth = new Date();
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  const currentMonthSales = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
          $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        }
      }
    },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  
  const previousMonthSales = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
          $lt: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1)
        }
      }
    },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  
  const currentTotal = currentMonthSales.length > 0 ? currentMonthSales[0].total : 0;
  const previousTotal = previousMonthSales.length > 0 ? previousMonthSales[0].total : 0;
  
  let salesGrowth = 0;
  if (previousTotal > 0) {
    salesGrowth = ((currentTotal - previousTotal) / previousTotal) * 100;
  }
  
  // Calculate customer growth (comparing current month to previous month)
  const currentMonthCustomers = await User.countDocuments({
    role: 'user',
    createdAt: {
      $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    }
  });
  
  const previousMonthCustomers = await User.countDocuments({
    role: 'user',
    createdAt: {
      $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
      $lt: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1)
    }
  });
  
  let customerGrowth = 0;
  if (previousMonthCustomers > 0) {
    customerGrowth = ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;
  }
  
  // Compile stats
  const stats = {
    salesSummary: {
      totalSales,
      ordersCount,
      averageOrderValue,
      salesGrowth: parseFloat(salesGrowth.toFixed(1))
    },
    salesByPeriod,
    customerMetrics: {
      totalCustomers,
      newCustomers: currentMonthCustomers,
      returningCustomers: totalCustomers - currentMonthCustomers,
      customerGrowth: parseFloat(customerGrowth.toFixed(1))
   },
   topSellingProducts
 };
 
 res.status(200).json(stats);
});

/**
 * Update color variant stock
 */
const updateColorStock = catchAsync(async (req, res, next) => {
  const { productId, colorIndex, inStock } = req.body;

  if (!productId || colorIndex === undefined || inStock === undefined) {
    return next(new AppError('Product ID, color index, and stock status are required', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (colorIndex >= product.colors.length || colorIndex < 0) {
    return next(new AppError('Invalid color index', 400));
  }

  product.colors[colorIndex].inStock = inStock;
  await product.save();

  res.status(200).json({
    status: 'success',
    message: `Color variant stock updated successfully`,
    data: product
  });
});

/**
 * Update color variant price
 */
const updateColorPrice = catchAsync(async (req, res, next) => {
  const { productId, colorIndex, price } = req.body;

  if (!productId || colorIndex === undefined) {
    return next(new AppError('Product ID and color index are required', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (colorIndex >= product.colors.length || colorIndex < 0) {
    return next(new AppError('Invalid color index', 400));
  }

  // If price is null or undefined, remove custom pricing (use main product price)
  if (price === null || price === undefined) {
    product.colors[colorIndex].price = undefined;
  } else {
    if (price < 0) {
      return next(new AppError('Price cannot be negative', 400));
    }
    product.colors[colorIndex].price = price;
  }

  await product.save();

  res.status(200).json({
    status: 'success',
    message: `Color variant price updated successfully`,
    data: product
  });
});

/**
 * Update color variant stock by exact number
 */
const updateColorStockNumber = catchAsync(async (req, res, next) => {
  const { productId, colorIndex, stock } = req.body;

  if (!productId || colorIndex === undefined || stock === undefined) {
    return next(new AppError('Product ID, color index, and stock number are required', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (colorIndex >= product.colors.length || colorIndex < 0) {
    return next(new AppError('Invalid color index', 400));
  }

  if (stock < 0) {
    return next(new AppError('Stock cannot be negative', 400));
  }

  // Add stock field if it doesn't exist and set the value
  product.colors[colorIndex].stock = stock;
  product.colors[colorIndex].inStock = stock > 0;
  
  await product.save();

  res.status(200).json({
    status: 'success',
    message: `Color variant stock updated to ${stock}`,
    data: product
  });
});

/**
 * Get products with detailed color information for admin
 */
const getProductsWithColorDetails = catchAsync(async (req, res, next) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 });

  // Transform products to include color variant details
  const productsWithDetails = products.map(product => ({
    ...product.toObject(),
    colors: product.colors.map((color, index) => ({
      ...color,
      index,
      effectivePrice: color.price || product.price,
      stock: color.stock || 0,
      inStock: color.inStock !== false
    }))
  }));

  res.status(200).json({
    status: 'success',
    results: productsWithDetails.length,
    data: productsWithDetails
  });
});

// Export all functions
module.exports = {
 getUsers,
 createUser,
 getUserById,
 updateUser,
 deleteUser,
 getProducts,
 createProduct,
 updateProduct,
 deleteProduct,
 getCategories,
 getOrders,
 getOrderById,
 getOrderWithDetails,
 getOrderTimeline,
 updateOrderStatus,
 getInventoryLogs,
 createInventoryLog,
 approveInventoryLog,
 rejectInventoryLog,
 promoteToAdmin,
 getDashboardStats,
 getCustomerInteractions,
 getCustomerOrderHistory,
 generateCustomerInsights,
 getCheckoutAnalytics,
 updateColorStock,
 updateColorPrice,
 updateColorStockNumber,
 getProductsWithColorDetails
};