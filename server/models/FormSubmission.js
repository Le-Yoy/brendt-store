// server/models/FormSubmission.js

const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'checkout', 'customOrder', 'sizeGuide', 'availabilityInquiry', 'returnExchange', 'feedback', 'newsletter'],
      required: true,
    },
    data: { 
      type: Object, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['new', 'inProgress', 'resolved'], 
      default: 'new' 
    },
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    response: { 
      type: String 
    },
    ip: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  { timestamps: true }
);

// Create index on type and creation date for efficient queries
formSubmissionSchema.index({ type: 1, createdAt: -1 });
formSubmissionSchema.index({ 'data.userId': 1 }, { sparse: true });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);