// server/scripts/add-brendtford.js
// Adds the "Brendtford" men's slip-on (3 colors) to the PROD database.
// Run ONLY after the images are deployed on Vercel (else the gallery 404s).
// Safe to re-run: refuses if a product with this name already exists.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Prod URI lives in add-anchor-point.js (server/.env points to localhost).
const MONGODB_URI = fs
  .readFileSync(path.join(__dirname, 'add-anchor-point.js'), 'utf8')
  .match(/mongodb\+srv:\/\/[^"']+/)[0];

const IMG = '/assets/images/products/brendt-new/Homme/chaussures/sneaker/Brendtford';
const STOCK_PER_COLOR = 20; // orders are rejected when a color's stock is 0

// Display order: AI side view → real photos → AI worn → AI pair.
const color = (name, code, reals) => ({
  name,
  code,
  images: ['profile', ...reals, 'worn', 'pair'].map((f) => `${IMG}/${name}/${f}.webp`),
  inStock: true,
  stock: STOCK_PER_COLOR,
});

const SIZES = [
  { name: '39', eu: '39', uk: '5', us: '6' },
  { name: '40', eu: '40', uk: '6', us: '7' },
  { name: '41', eu: '41', uk: '7', us: '8' },
  { name: '42', eu: '42', uk: '8', us: '9' },
  { name: '43', eu: '43', uk: '9', us: '10' },
  { name: '44', eu: '44', uk: '10', us: '11' },
].map((s) => ({ ...s, available: true }));

async function addBrendtford() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const existing = await Product.findOne({ name: 'Brendtford' });
    if (existing) {
      console.log('⚠️ Brendtford already exists:', existing._id.toString());
      process.exit();
    }

    const saved = await new Product({
      name: 'Brendtford',
      price: 549,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'sneaker',
      subcategoryName: 'sneaker',
      description:
        'Slip-on en cuir grainé, élastiques croisés et semelle noire. Un modèle sans lacets, disponible en noir, marron et bleu.',
      details: ['Cuir grainé', 'Élastiques croisés, sans lacets', 'Semelle noire'],
      care:
        'Nettoyez avec un chiffon légèrement humide. Laissez sécher naturellement loin de toute source de chaleur. Utilisez des embauchoirs entre chaque port.',
      colors: [
        color('Noir', '#111111', ['real-1', 'real-2']),
        color('Marron', '#8a4b24', ['real-1', 'real-2']),
        color('Bleu', '#1f3a8a', ['real-1', 'real-2', 'real-3']),
      ],
      materials: ['Cuir'],
      sizes: SIZES,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      isNewArrival: true,
      isBestseller: false,
      gender: 'homme',
    }).save();

    console.log('✅ Brendtford added!');
    console.log('Product ID:', saved._id.toString());
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addBrendtford();
