const mongoose = require('mongoose');
require('dotenv').config({ path: '../server/.env' });

// Get MongoDB URI from .env file or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brendt';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
  fixGenderField();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import the Product model
const Product = require('../../server/models/Product');

async function fixGenderField() {
  try {
    console.log('Starting gender field fix...');
    
    // Count products
    const totalProducts = await Product.countDocuments();
    console.log(`Total products in database: ${totalProducts}`);
    
    // Check for products without gender
    const missingGender = await Product.countDocuments({ gender: { $exists: false } });
    console.log(`Products missing gender field: ${missingGender}`);
    
    if (missingGender > 0) {
      console.log('Fixing products without gender field...');
      
      // Update products missing gender based on directory structure
      const updatedHomme = await Product.updateMany(
        { 
          gender: { $exists: false },
          'colors.images': { $regex: /\/Homme\//i } 
        }, 
        { $set: { gender: 'homme' } }
      );
      
      console.log(`Updated ${updatedHomme.modifiedCount} products with gender 'homme'`);
      
      const updatedFemme = await Product.updateMany(
        { 
          gender: { $exists: false },
          'colors.images': { $regex: /\/Femme\//i } 
        }, 
        { $set: { gender: 'femme' } }
      );
      
      console.log(`Updated ${updatedFemme.modifiedCount} products with gender 'femme'`);
      
      // Default remaining products to 'homme' if still missing gender
      const stillMissing = await Product.countDocuments({ gender: { $exists: false } });
      if (stillMissing > 0) {
        console.log(`${stillMissing} products still missing gender, setting default to homme`);
        const defaultHomme = await Product.updateMany(
          { gender: { $exists: false } },
          { $set: { gender: 'homme' } }
        );
        console.log(`Set default gender for ${defaultHomme.modifiedCount} products`);
      }
    }
    
    // Log final distribution
    const hommeCount = await Product.countDocuments({ gender: 'homme' });
    const femmeCount = await Product.countDocuments({ gender: 'femme' });
    console.log(`Final distribution - Homme: ${hommeCount}, Femme: ${femmeCount}`);
    console.log('Gender field fix completed');
    
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing gender field:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}