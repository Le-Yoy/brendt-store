const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brendt')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const Product = require('./models/Product');

async function checkProducts() {
  const femmeProducts = await Product.find({ gender: 'femme' });
  console.log(`Found ${femmeProducts.length} women's products`);
  console.log('Products:', femmeProducts.map(p => ({ name: p.name, category: p.category, subcategory: p.subcategory })));
  
  const babouches = await Product.find({ subcategory: 'babouches' });
  console.log(`\nFound ${babouches.length} babouches products`);
  console.log('Babouches:', babouches.map(p => ({ name: p.name, gender: p.gender })));
  
  mongoose.disconnect();
}

checkProducts();