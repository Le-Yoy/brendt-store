// server/scripts/update-tarhazout-images.js
// Surgically updates the per-color image arrays of the Tarhazout product
// (id 684de02754a158e11ff1cad5) on PRODUCTION. Non-destructive: loads the doc,
// rewrites colors[].images for the listed colors, saves. Leaves all other
// products, orders, prices and stock untouched. Bleu is intentionally left as-is.
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGODB_URI = "mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy";
const TARHAZOUT_ID = '684de02754a158e11ff1cad5';
const BASE = '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout';

// Final ordered galleries: 1-2 clean studio shots first, then lifestyle.
const NEW_IMAGES = {
  'Beige': [
    `${BASE}/Raffia-Beige/1.webp`, `${BASE}/Raffia-Beige/2.webp`,
    `${BASE}/Raffia-Beige/3.webp`, `${BASE}/Raffia-Beige/4.webp`,
    `${BASE}/Raffia-Beige/5.webp`, `${BASE}/Raffia-Beige/6.webp`,
  ],
  'Marron': [
    `${BASE}/Raffia-Marron/1.webp`, `${BASE}/Raffia-Marron/2.webp`,
    `${BASE}/Raffia-Marron/3.webp`, `${BASE}/Raffia-Marron/4.webp`,
    `${BASE}/Raffia-Marron/5.webp`,
  ],
  'Marron & Beige': [
    `${BASE}/Raffia-Marron-&-Beige/1.webp`, `${BASE}/Raffia-Marron-&-Beige/2.webp`,
    `${BASE}/Raffia-Marron-&-Beige/5.webp`, `${BASE}/Raffia-Marron-&-Beige/6.webp`,
  ],
  'Bleu & Beige': [
    `${BASE}/Raffia-Bleu-&-Beige/1.jpg`, `${BASE}/Raffia-Bleu-&-Beige/2.jpg`,
    `${BASE}/Raffia-Bleu-&-Beige/4.webp`, `${BASE}/Raffia-Bleu-&-Beige/5.webp`,
    `${BASE}/Raffia-Bleu-&-Beige/6.webp`,
  ],
};

(async () => {
  try {
    console.log('Connecting to MongoDB (production)...');
    await mongoose.connect(MONGODB_URI);

    const product = await Product.findById(TARHAZOUT_ID);
    if (!product) { console.log('❌ Tarhazout product not found'); process.exit(1); }

    console.log(`\nFound: ${product.name} (${product.colors.length} colors)\n`);
    let changed = 0;
    product.colors.forEach((c) => {
      if (NEW_IMAGES[c.name]) {
        console.log(`  ${c.name}: ${c.images.length} -> ${NEW_IMAGES[c.name].length} images`);
        c.images = NEW_IMAGES[c.name];
        changed++;
      } else {
        console.log(`  ${c.name}: unchanged (${c.images.length} images)`);
      }
    });

    product.markModified('colors');
    await product.save();
    console.log(`\n✅ Saved. ${changed} colors updated.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
