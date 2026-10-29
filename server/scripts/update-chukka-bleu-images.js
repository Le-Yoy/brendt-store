// server/scripts/update-chukka-bleu-images.js
// Points the Chukka Grainé "Bleu" color at its new, sharper photo set (4 images).
// Run ONLY after the image files are deployed on Vercel.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Prod URI lives in add-anchor-point.js (server/.env points to localhost).
const MONGODB_URI = fs
  .readFileSync(path.join(__dirname, 'add-anchor-point.js'), 'utf8')
  .match(/mongodb\+srv:\/\/[^"']+/)[0];

const CHUKKA_ID = '6ae36a4181aeaef007bcaf49';
const IMG = '/assets/images/products/brendt-new/Homme/chaussures/boots/Chukka-Graine/Bleu';

async function updateBleuImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    const product = await Product.findById(CHUKKA_ID);
    if (!product) throw new Error('Chukka Grainé not found');

    const bleu = product.colors.find((c) => c.name === 'Bleu');
    if (!bleu) throw new Error('Bleu color not found');

    bleu.images = [1, 2, 3, 4].map((n) => `${IMG}/${n}.webp`);
    product.markModified('colors');
    await product.save();

    console.log('✅ Bleu images updated:', bleu.images);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBleuImages();
