// server/models/Order.js

const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema(
  {
    // Add orderNumber field (NOT required - it will be generated automatically)
    orderNumber: {
      type: String,
      unique: true
      // Removed required: true - this is generated automatically
    },
    // Add guest order flag
    isGuestOrder: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return !this.isGuestOrder; // Only required if NOT a guest order
      }
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Order item must have a product']
        },
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: [true, 'Order item must have a quantity'],
          min: [1, 'Quantity must be at least 1'],
          default: 1,
        },
        price: {
          type: Number,
          required: true
        },
        size: {
          type: String
        },
        color: {
          type: String
        }
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [50, 'Full name cannot exceed 50 characters']
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
      },
      city: {
        type: String,
        required: true
      },
      postalCode: {
        type: String
      },
      country: {
        type: String,
        default: 'Maroc'
      }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'cash', 'transfer'],
      default: 'cash'
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    itemsPrice: {
      type: Number,
      required: [true, 'Order must have an items price'],
      min: [0, 'Items price cannot be negative'],
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: [0, 'Shipping price cannot be negative'],
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Order must have a total price'],
      min: [0, 'Total price cannot be negative'],
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    processingAt: {
      type: Date
    },
    isPacked: {
      type: Boolean,
      default: false
    },
    packedAt: {
      type: Date
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippedAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    trackingNumber: {
      type: String
    },
    trackingUrl: {
      type: String
    },
    carrier: {
      type: String
    },
    estimatedDeliveryDate: {
      type: Date
    },
    notes: {
      type: String
    },
    adminNotes: [
      {
        text: { type: String, required: true },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        note: String
      }
    ],
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: {
      type: Date
    },
    cancelReason: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1, isShipped: 1, isDelivered: 1 });
orderSchema.index({ orderNumber: 1 }); // Add index for orderNumber

// Pre-save middleware to assign sequential order number
orderSchema.pre('save', async function(next) {
  // If this is a new document and doesn't have an order number, assign one
  if (this.isNew && !this.orderNumber) {
    try {
      const sequence = await Counter.getNextSequence('order_number');
      this.orderNumber = sequence.toString().padStart(5, '0');
    } catch (error) {
      return next(error);
    }
  }
  
  // If this is a new document, add initial 'pending' status
  if (this.isNew) {
    this.statusHistory = [{
      status: 'pending',
      timestamp: this.createdAt || new Date(),
      note: 'Order created'
    }];
  } else {
    // Check if status has changed
    const currentStatus = this.getStatus();
    
    // Find the last status in history
    const lastStatus = this.statusHistory.length > 0 
      ? this.statusHistory[this.statusHistory.length - 1].status 
      : null;
    
    // If status changed, add new entry to history
    if (currentStatus !== lastStatus) {
      this.statusHistory.push({
        status: currentStatus,
        timestamp: new Date(),
        updatedBy: this._updatedBy, // This should be set before saving
        note: this._statusNote || '' // This can be set before saving
      });
    }
  }
  
  next();
});

// Helper method to get current status
orderSchema.methods.getStatus = function() {
  if (this.isCancelled) return 'cancelled';
  if (this.isDelivered) return 'delivered';
  if (this.isShipped) return 'shipped';
  if (this.isPacked) return 'packed';
  if (this.isPaid || this.isProcessing) return 'processing';
  return 'pending';
};

// Virtual for computed status
orderSchema.virtual('status').get(function() {
  return this.getStatus();
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update status with audit trail
orderSchema.methods.updateStatus = async function(newStatus, userId, note) {
  // Set properties for pre-save middleware
  this._updatedBy = userId;
  this._statusNote = note;
  
  // Update appropriate fields based on status
  switch (newStatus) {
    case 'processing':
      this.isPaid = true;
      if (!this.paidAt) this.paidAt = Date.now();
      this.isProcessing = true;
      this.processingAt = Date.now();
      break;
    case 'packed':
      this.isPacked = true;
      this.packedAt = Date.now();
      break;
    case 'shipped':
      this.isShipped = true;
      this.shippedAt = Date.now();
      break;
    case 'delivered':
      this.isDelivered = true;
      this.deliveredAt = Date.now();
      break;
    case 'cancelled':
      this.isCancelled = true;
      this.cancelledAt = Date.now();
      this.cancelReason = note || 'No reason provided';
      break;
  }
  
  // Save the document to trigger pre-save middleware
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;