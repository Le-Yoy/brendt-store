// scripts/import-to-db.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brendt';
console.log('Using MongoDB URI:', MONGODB_URI);

// Load product data
const productsPath = path.resolve(__dirname, '../src/utils/productData.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Loaded ${products.length} products from JSON file`);

// Define schemas here - must match the server model
const sizeSchema = new mongoose.Schema({
 name: { type: String, required: true },
 eu: String,
 uk: String,
 us: String,
 handWidth: String,
 available: { type: Boolean, default: true }
}, { _id: false });

const colorVariantSchema = new mongoose.Schema({
 name: { type: String, required: true },
 code: { type: String, required: true },
 images: [{ type: String }]
}, { _id: false });

// Define product schema - ensure it matches the server model
const productSchema = new mongoose.Schema(
 {
   id: String,
   name: String,
   price: Number,
   previousPrice: mongoose.Schema.Types.Mixed,
   discount: mongoose.Schema.Types.Mixed,
   category: String,
   categoryName: String,
   subcategory: String,
   subcategoryName: String,
   description: String,
   details: [String],
   care: String,
   colors: [colorVariantSchema],
   materials: [String],
   sizes: [sizeSchema],
   rating: Number,
   reviewCount: Number,
   inStock: Boolean,
   isNewArrival: Boolean,
   isBestseller: Boolean,
   gender: { type: String, enum: ['homme', 'femme'], required: true }
 },
 {
   timestamps: true,
   collection: 'products' // Force the collection name to match server
 }
);

async function importProducts() {
 try {
   console.log('Connecting to MongoDB...');
   await mongoose.connect(MONGODB_URI);
   console.log('MongoDB connected successfully!');
   
   const db = mongoose.connection.db;
   console.log('Connected to database:', db.databaseName);
   console.log('Available collections:', await db.listCollections().toArray().then(cols => cols.map(c => c.name)));
   
   // Create model using the schema and force collection name
   console.log('Creating Product model with schema');
   const Product = mongoose.model('Product', productSchema, 'products');
   console.log('Model collection name:', Product.collection.name);
   
   // Clear existing products
   const deleted = await Product.deleteMany({});
   console.log(`Cleared ${deleted.deletedCount} existing products`);
   
   // Process products before import to ensure they meet schema requirements
   const validProducts = products.map(product => {
     // Ensure each product has required fields
     const processedProduct = {
       ...product,
       description: product.description || `Produit ${product.name} de haute qualité`, // Default description
       details: product.details || [],
       care: product.care || ''
     };
     
     // Ensure gender field is set
     if (!processedProduct.gender) {
       // Determine gender from directory structure or product ID
       if (processedProduct.id && processedProduct.id.startsWith('homme-')) {
         processedProduct.gender = 'homme';
       } else if (processedProduct.id && processedProduct.id.startsWith('femme-')) {
         processedProduct.gender = 'femme';
       } else if (processedProduct.colors && processedProduct.colors.some(c => 
           c.images && c.images.some(img => img.includes('/Homme/')))) {
         processedProduct.gender = 'homme';
       } else if (processedProduct.colors && processedProduct.colors.some(c => 
           c.images && c.images.some(img => img.includes('/Femme/')))) {
         processedProduct.gender = 'femme';
       } else {
         // Default to homme if gender cannot be determined
         processedProduct.gender = 'homme';
         console.log(`Default gender 'homme' assigned to product: ${processedProduct.name}`);
       }
     }
     
     // Ensure each color has at least one image
     if (processedProduct.colors && processedProduct.colors.length > 0) {
       processedProduct.colors = processedProduct.colors.map(color => {
         if (!color.images || color.images.length === 0) {
           return {
             ...color,
             images: ['/assets/images/placeholder.jpg']
           };
         }
         return color;
       });
     } else {
       // Provide default color if missing
       processedProduct.colors = [
         {
           name: 'Classique',
           code: '#4A4A4A',
           images: ['/assets/images/placeholder.jpg']
         }
       ];
     }
     
     // Ensure each product has sizes
     if (!processedProduct.sizes || processedProduct.sizes.length === 0) {
       if (processedProduct.category === 'chaussures') {
         if (processedProduct.gender === 'femme') {
           processedProduct.sizes = [
             { name: '37', eu: '37', uk: '4', us: '6', available: true },
             { name: '38', eu: '38', uk: '5', us: '7', available: true },
             { name: '39', eu: '39', uk: '6', us: '8', available: true }
           ];
         } else {
           processedProduct.sizes = [
             { name: '42', eu: '42', uk: '8', us: '9', available: true },
             { name: '43', eu: '43', uk: '9', us: '10', available: true }
           ];
         }
       } else {
         if (processedProduct.gender === 'femme') {
           processedProduct.sizes = [
             { name: 'S', available: true },
             { name: 'M', available: true }
           ];
         } else {
           processedProduct.sizes = [
             { name: 'M', available: true },
             { name: 'L', available: true }
           ];
         }
       }
     }
     
     return processedProduct;
   });
   
   // Import in batches to avoid overwhelming the database
   let imported = 0;
   const batchSize = 5; // Smaller batch size to better handle errors
   
   for (let i = 0; i < validProducts.length; i += batchSize) {
     const batch = validProducts.slice(i, i + batchSize);
     try {
       await Product.insertMany(batch, { ordered: false });
       imported += batch.length;
       console.log(`Imported ${imported}/${validProducts.length} products`);
     } catch (err) {
       console.error('Error in batch import:', err.message);
       // Try one by one if batch fails
       for (const product of batch) {
         try {
           await Product.create(product);
           imported++;
           console.log(`Individually imported product: ${product.name}`);
         } catch (productErr) {
           console.error(`Failed to import product ${product.name}:`, productErr.message);
         }
       }
     }
   }
   
   // Verify final result
   const finalCount = await Product.countDocuments();
   console.log(`Final product count in database: ${finalCount}`);
   
   // Count products by gender
   const hommeCount = await Product.countDocuments({ gender: 'homme' });
   const femmeCount = await Product.countDocuments({ gender: 'femme' });
   console.log(`Gender distribution - Homme: ${hommeCount}, Femme: ${femmeCount}`);
   
   console.log(`Successfully imported products to MongoDB!`);
 } catch (error) {
   console.error('Error importing products:', error);
 } finally {
   await mongoose.connection.close();
   console.log('MongoDB connection closed');
 }
}

importProducts();