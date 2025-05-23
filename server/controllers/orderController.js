const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Counter = require('../models/Counter');

// Initialize order counter on startup
const initOrderCounter = async () => {
  try {
    // Check if counter already exists
    const existingCounter = await Counter.findById('order_number');
    if (!existingCounter) {
      // Initialize counter starting from 0
      await Counter.create({ _id: 'order_number', sequence_value: 0 });
      console.log('Order counter initialized');
    }
  } catch (error) {
    console.error('Error initializing order counter:', error);
  }
};

// Call this when the server starts
initOrderCounter();

// Create a new order (now with automatic stock deduction via middleware)
const createOrder = catchAsync(async (req, res, next) => {
  console.log('========= ORDER CREATION ATTEMPT =========');
  console.log('User:', req.user ? { 
    id: req.user._id, 
    email: req.user.email, 
    role: req.user.role || 'unknown' 
  } : 'Guest user (not authenticated)');
  console.log('Order data:', JSON.stringify(req.body, null, 2));
  
  try {
    // Format phone number if needed
    if (req.body.shippingAddress && req.body.shippingAddress.phoneNumber) {
      const phone = req.body.shippingAddress.phoneNumber;
      if (phone.startsWith('0')) {
        // Convert Moroccan format (06...) to international format (+212...)
        req.body.shippingAddress.phoneNumber = `+212${phone.substring(1)}`;
        console.log('Phone number reformatted to:', req.body.shippingAddress.phoneNumber);
      }
    }
    
    // Create base order data
    const orderData = {
      ...req.body
    };
    
    // Add user ID if authenticated, otherwise mark as guest order
    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.isGuestOrder = true;
    }
    
    // Create and save the order
    const order = new Order(orderData);
    
    // Check for validation errors before saving
    const validationError = order.validateSync();
    if (validationError) {
      console.log('VALIDATION ERROR:', JSON.stringify(validationError.errors, null, 2));
      return next(new AppError(Object.values(validationError.errors)[0].message, 400));
    }
    
    const createdOrder = await order.save();
    console.log('ORDER CREATED SUCCESSFULLY:', {
      id: createdOrder._id,
      orderNumber: createdOrder.orderNumber
    });
    
    // Stock deduction is handled by middleware
    // If we reach this point, stock was successfully deducted
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log('ORDER CREATION ERROR:', error.message);
    console.log('Error details:', error);
    return next(new AppError(error.message || 'Order creation failed', 400));
  }
});

// Get a single order by ID
const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Only allow access if the order belongs to the user or if user is admin
  if (order.user && req.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this order', 401));
  }

  res.json(order);
});

// Update order to paid
const updateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  
  if (req.body.paymentResult) {
    order.paymentResult = req.body.paymentResult;
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// Update order to delivered
const updateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// Cancel order and restore stock
const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.isCancelled) {
    return next(new AppError('Order is already cancelled', 400));
  }

  // Set order as cancelled
  order.isCancelled = true;
  order.cancelledAt = Date.now();
  order.cancelReason = req.body.reason || 'Cancelled by admin';

  // Add to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  
  order.statusHistory.push({
    status: 'cancelled',
    timestamp: Date.now(),
    updatedBy: req.user._id,
    note: order.cancelReason
  });

  // Attach order to request for middleware
  req.order = order;
  
  const updatedOrder = await order.save();
  
  // Stock restoration will be handled by middleware
  res.json(updatedOrder);
});

// Get logged in user orders
const getMyOrders = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// Get all orders 
const getAllOrders = catchAsync(async (req, res) => {
  // Find all orders, including both user and guest orders
  const orders = await Order.find({}).populate('user', 'name email');
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  getMyOrders,
  getAllOrders,
  initOrderCounter // Export for manual initialization if needed
};