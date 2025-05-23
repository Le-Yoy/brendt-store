// server/models/Category.js

const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'A category name must have less or equal than 50 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    image: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Virtual populate to get subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  foreignField: 'parent',
  localField: '_id'
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;