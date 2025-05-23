// server/models/Product.js
const mongoose = require('mongoose');

// Size schema for different product types
const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eu: String,
  uk: String,
  us: String,
  handWidth: String,
  available: { type: Boolean, default: true }
}, { _id: false });

// Color variant schema with optional price and stock
const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number }, // Optional price for this specific color variant
  inStock: { type: Boolean, default: true }, // Per-color stock control
  stock: { type: Number, default: 0 } // ADDED: Exact stock quantity for each color
}, { _id: false });

// Comprehensive product schema matching scanner output
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative']
    },
    previousPrice: {
      type: Number,
      default: null
    },
    discount: {
      type: Number,
      default: null
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category']
    },
    categoryName: {
      type: String,
      required: [true, 'Please provide a category name']
    },
    subcategory: {
      type: String,
      required: [true, 'Please provide a product subcategory']
    },
    subcategoryName: {
      type: String,
      required: [true, 'Please provide a subcategory name']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    details: {
      type: [String],
      default: []
    },
    care: {
      type: String,
      default: ''
    },
    colors: {
      type: [colorVariantSchema],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'At least one color variant must be specified'
      }
    },
    materials: {
      type: [String],
      default: []
    },
    sizes: {
      type: [sizeSchema],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'At least one size must be specified'
      }
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    gender: {
      type: String,
      enum: ['homme', 'femme'],
      required: [true, 'Please specify product gender']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'products' // Explicitly set collection name
  }
);

// Index for faster queries
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Modify pre-save hook to be less strict for debugging
productSchema.pre('save', function(next) {
  // Only validate color images in production
  if (process.env.NODE_ENV === 'production') {
    if (this.colors.some(color => !color.images || color.images.length === 0)) {
      const err = new Error('Each color variant must have at least one image');
      return next(err);
    }
  }
  next();
});

// Virtual for available sizes count
productSchema.virtual('availableSizesCount').get(function() {
  return this.sizes.filter(size => size.available).length;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;