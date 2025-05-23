// scripts/importProducts.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const colors = require('colors');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import product scanner
const { scanHommeProducts } = require('../src/utils/brendtProductScanner');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brendt';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...'.yellow);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully!'.green);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:'.red, error.message);
    return false;
  }
}

/**
 * Import products directly to MongoDB using Mongoose
 */
async function importProductsToMongoDB(products) {
  try {
    console.log(`\nImporting ${products.length} products to MongoDB...`.yellow);
    
    // Import Product model
    const Product = mongoose.model('Product');
    
    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`.cyan);
    
    // Insert new products
    const result = await Product.insertMany(products, { 
      ordered: false,
      throwOnValidationError: true 
    });
    
    console.log(`Successfully imported ${result.length} products to MongoDB!`.green);
    return true;
  } catch (error) {
    console.error('Error importing products to MongoDB:'.red);
    
    if (error.writeErrors) {
      error.writeErrors.forEach(err => {
        console.error(`- Error on document ${err.index}:`.red, err.errmsg);
      });
    } else {
      console.error(error);
    }
    
    return false;
  }
}

/**
 * Import products using the REST API
 */
async function importProductsViaAPI(products) {
  console.log(`\nImporting ${products.length} products via API...`.yellow);
  
  let successCount = 0;
  let errorCount = 0;
  
  // First clear existing products
  try {
    console.log('Clearing existing products...'.cyan);
    
    // Get all existing products
    const response = await axios.get(`${API_BASE_URL}/products`);
    const existingProducts = response.data;
    
    // Delete each product
    for (const product of existingProducts) {
      await axios.delete(`${API_BASE_URL}/products/${product._id}`);
    }
    
    console.log(`Cleared ${existingProducts.length} existing products`.cyan);
  } catch (error) {
    console.error('Error clearing existing products:'.red, error.message);
  }
  
  // Create progress bar
  const progressBarWidth = 40;
  
  // Import each product
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // Update progress bar
    const progress = Math.floor((i / products.length) * progressBarWidth);
    const progressBar = '█'.repeat(progress) + '░'.repeat(progressBarWidth - progress);
    process.stdout.write(`\r[${progressBar}] ${i}/${products.length} products imported`);
    
    try {
      await axios.post(`${API_BASE_URL}/products`, product);
      successCount++;
    } catch (error) {
      errorCount++;
      
      // Log detailed error (not in progress bar line)
      if (error.response) {
        console.error(`\nError importing product ${product.name}:`.red, error.response.data);
      } else {
        console.error(`\nError importing product ${product.name}:`.red, error.message);
      }
    }
  }
  
  console.log(`\n\nImport completed: ${successCount.toString().green} successful, ${errorCount.toString().red} failed`);
  return errorCount === 0;
}

/**
 * Save products to JSON file for backup
 */
function saveProductsToJSON(products) {
  console.log('\nSaving products to JSON file...'.yellow);
  
  const outputPath = path.resolve(__dirname, '../src/utils/productData.json');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');
  
  console.log(`Products saved to: ${outputPath}`.green);
}

/**
 * Main function
 */
async function main() {
  console.log('========================================'.blue);
  console.log('  BRENDT-PROJECT PRODUCT MIGRATION TOOL '.blue);
  console.log('========================================'.blue);
  
  // Scan product directory to generate products
  console.log('\nScanning product directories...'.yellow);
  const products = scanHommeProducts();
  
  if (!products || products.length === 0) {
    console.error('No products found! Check scanner configuration.'.red);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} products.`.green);
  
  // Save products to JSON file (backup)
  saveProductsToJSON(products);
  
  // Ask user for import method
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\nChoose import method:\n1. Direct MongoDB import (faster)\n2. API import (more validation)\nEnter choice (1/2): ', async (choice) => {
    let success = false;
    
    if (choice === '1') {
      // Method 1: Direct MongoDB import
      const connected = await connectToDatabase();
      if (connected) {
        success = await importProductsToMongoDB(products);
      }
    } else {
      // Method 2: API import
      success = await importProductsViaAPI(products);
    }
    
    // Close MongoDB connection if opened
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.'.yellow);
    }
    
    readline.close();
    
    console.log('\n========================================'.blue);
    console.log(`Migration ${success ? 'COMPLETED'.green : 'FAILED'.red}`);
    console.log('========================================'.blue);
    
    process.exit(success ? 0 : 1);
  });
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:'.red, error);
  process.exit(1);
});