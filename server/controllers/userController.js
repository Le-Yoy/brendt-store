const User = require('../models/User');
const Order = require('../models/Order');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

const registerUser = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    console.log('[SERVER] Registration attempt:', { 
      name, 
      email, 
      passwordProvided: !!password 
    });
    
    if (!name || !email || !password) {
      console.error('[SERVER] Missing required fields for registration');
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and password',
        token: '[MISSING]'
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[SERVER] Registration failed: User already exists with email:', email);
      return res.status(400).json({
        success: false,
        error: 'User already exists',
        token: '[MISSING]'
      });
    }
    
    const userRole = req.user && req.user.role === 'admin' && role === 'admin' ? 'admin' : 'user';
    
    console.log('[SERVER] Creating user with data:', { name, email, role: userRole });
    
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });
    
    console.log('[SERVER] User created successfully:', { id: user._id, email: user.email });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: token
    });
  } catch (err) {
    console.error('[SERVER] Registration error:', err);
    return res.status(400).json({
      success: false,
      error: 'JWT configuration error',
      token: '[MISSING]'
    });
  }
});

const loginUser = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('[SERVER] Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
        token: '[MISSING]'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        token: '[MISSING]'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    console.log('[SERVER] Login successful for user:', user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: token
    });
  } catch (err) {
    console.error('[SERVER] Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'JWT configuration error',
      token: '[MISSING]'
    });
  }
});

const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shippingAddresses: user.shippingAddresses || [],
      paymentPreferences: user.paymentPreferences || {}
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

const updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update payment preferences if provided
    if (req.body.paymentPreferences) {
      user.paymentPreferences = {
        ...user.paymentPreferences,
        ...req.body.paymentPreferences
      };
    }

    const updatedUser = await user.save();

    // Fetch the user again to ensure we have the most up-to-date information
    const refreshedUser = await User.findById(updatedUser._id);

    res.json({
      _id: refreshedUser._id,
      name: refreshedUser.name,
      email: refreshedUser.email,
      role: refreshedUser.role,
      shippingAddresses: refreshedUser.shippingAddresses || [],
      paymentPreferences: refreshedUser.paymentPreferences || {},
      token: generateToken(refreshedUser._id),
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

const getUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

const addShippingAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Initialize shipping addresses array if it doesn't exist
  if (!user.shippingAddresses) {
    user.shippingAddresses = [];
  }
  
  // If this is set as default, unset any existing default
  if (req.body.isDefault) {
    user.shippingAddresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Add new address
  user.shippingAddresses.push(req.body);
  await user.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      shippingAddresses: user.shippingAddresses
    }
  });
});

const updateShippingAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.addressId;
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Find the address index
  const addressIndex = user.shippingAddresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  
  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }
  
  // If setting as default, unset other defaults
  if (req.body.isDefault) {
    user.shippingAddresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Update the address
  user.shippingAddresses[addressIndex] = {
    ...user.shippingAddresses[addressIndex].toObject(),
    ...req.body
  };
  
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      shippingAddresses: user.shippingAddresses
    }
  });
});

const deleteShippingAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.addressId;
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Filter out the address to delete
  user.shippingAddresses = user.shippingAddresses.filter(
    addr => addr._id.toString() !== addressId
  );
  
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      shippingAddresses: user.shippingAddresses
    }
  });
});

const getUserStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  
  // Get all user orders
  const orders = await Order.find({ user: userId });
  
  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  res.status(200).json({
    status: 'success',
    data: {
      totalOrders,
      totalSpent: Number(totalSpent.toFixed(2)),
      averageOrderValue: totalOrders > 0 ? Number((totalSpent / totalOrders).toFixed(2)) : 0
    }
  });
});



// Verify email (uncomment and implement if you add email verification)
/*
const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
});
*/

// Export all controller functions
module.exports = {
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
};