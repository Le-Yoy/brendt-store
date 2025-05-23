// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again!', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired! Please log in again.', 401));
    }
    return next(new AppError('Authentication failed', 401));
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be added by protect middleware)
    if (!req.user) {
      return next(new AppError('User not found', 401));
    }
    
    // Check if user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    
    next();
  };
};
// Optional authentication middleware - continues if no token or invalid token
const optionalAuth = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // No token, but that's okay - continue as guest
    req.user = null;
    return next();
  }

  // 2) Verification token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (currentUser) {
      // 4) Attach user to request
      req.user = currentUser;
    } else {
      req.user = null;
    }
    next();
  } catch (err) {
    // Invalid token, but that's okay - continue as guest
    req.user = null;
    next();
  }
});

module.exports = { protect, authorize, optionalAuth };