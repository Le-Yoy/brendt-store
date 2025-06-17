const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

async function checkSandales() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const sandales = await Product.find({ subcategory: 'sandales' });
    console.log(`Found ${sandales.length} sandales in DB`);
    sandales.forEach(p => console.log(`- ${p.name}`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
checkSandales();
