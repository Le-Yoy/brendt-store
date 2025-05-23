// Create new file: /server/middleware/stockMiddleware.js

const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Middleware to automatically deduct stock when an order is created
 */
const deductStockOnOrder = catchAsync(async (req, res, next) => {
  // Only process for order creation
  if (req.method === 'POST' && req.body.orderItems) {
    const { orderItems } = req.body;
    
    // Track stock deductions for rollback if needed
    const stockDeductions = [];
    
    try {
      // Process each order item
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        
        if (!product) {
          throw new AppError(`Product not found: ${item.product}`, 404);
        }
        
        // Find the specific color variant
        const colorIndex = product.colors.findIndex(
          color => color.name === item.color || color.code === item.colorCode
        );
        
        if (colorIndex === -1) {
          throw new AppError(`Color variant not found for product: ${product.name}`, 404);
        }
        
        const colorVariant = product.colors[colorIndex];
        
        // Check if enough stock is available
        if (colorVariant.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for ${product.name} - ${colorVariant.name}. Available: ${colorVariant.stock}, Requested: ${item.quantity}`,
            400
          );
        }
        
        // Deduct stock
        const originalStock = colorVariant.stock;
        colorVariant.stock -= item.quantity;
        
        // Update inStock status if stock reaches zero
        if (colorVariant.stock === 0) {
          colorVariant.inStock = false;
        }
        
        // Save the product
        await product.save();
        
        // Track deduction for potential rollback
        stockDeductions.push({
          productId: product._id,
          colorIndex,
          deductedQuantity: item.quantity,
          originalStock
        });
        
        console.log(`Stock deducted: ${product.name} - ${colorVariant.name}: ${originalStock} -> ${colorVariant.stock}`);
      }
      
      // Attach deductions to request for potential rollback
      req.stockDeductions = stockDeductions;
      
    } catch (error) {
      // Rollback any stock deductions made so far
      await rollbackStockDeductions(stockDeductions);
      throw error;
    }
  }
  
  next();
});

/**
 * Rollback stock deductions in case of error
 */
const rollbackStockDeductions = async (deductions) => {
  for (const deduction of deductions) {
    try {
      const product = await Product.findById(deduction.productId);
      if (product && product.colors[deduction.colorIndex]) {
        product.colors[deduction.colorIndex].stock = deduction.originalStock;
        product.colors[deduction.colorIndex].inStock = true;
        await product.save();
        console.log(`Rolled back stock deduction for product ${deduction.productId}, color ${deduction.colorIndex}`);
      }
    } catch (rollbackError) {
      console.error('Error rolling back stock deduction:', rollbackError);
    }
  }
};

/**
 * Middleware to restore stock when an order is cancelled or refunded
 */
const restoreStockOnCancel = catchAsync(async (req, res, next) => {
  const { orderItems } = req.order; // Assuming order is attached to request
  
  try {
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (product) {
        const colorIndex = product.colors.findIndex(
          color => color.name === item.color || color.code === item.colorCode
        );
        
        if (colorIndex !== -1) {
          const colorVariant = product.colors[colorIndex];
          
          // Restore stock
          colorVariant.stock += item.quantity;
          colorVariant.inStock = true;
          
          await product.save();
          
          console.log(`Stock restored: ${product.name} - ${colorVariant.name}: +${item.quantity}`);
        }
      }
    }
  } catch (error) {
    console.error('Error restoring stock:', error);
    // Don't throw error as this is cleanup operation
  }
  
  next();
});

module.exports = {
  deductStockOnOrder,
  restoreStockOnCancel
};