// server/scripts/add-chukka-graine.js
// Adds the "Chukka Grainé" men's boot (4 colors) to the PROD database.
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

const IMG = '/assets/images/products/brendt-new/Homme/chaussures/boots/Chukka-Graine';
const STOCK_PER_COLOR = 20; // orders are rejected when a color's stock is 0

const color = (name, code, folder, count) => ({
  name,
  code,
  images: Array.from({ length: count }, (_, i) => `${IMG}/${folder}/${i + 1}.webp`),
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

async function addChukkaGraine() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const existing = await Product.findOne({ name: 'Chukka Grainé' });
    if (existing) {
      console.log('⚠️ Chukka Grainé already exists:', existing._id.toString());
      process.exit();
    }

    const chukka = new Product({
      name: 'Chukka Grainé',
      price: 459,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'boots',
      subcategoryName: 'Boots',
      description:
        "Chukka en cuir grainé, doublure moutarde et semelle épaisse et légère. Une chukka confortable pour tous les jours, disponible en noir, bleu navy, marron et bleu.",
      details: [
        'Cuir grainé',
        'Doublure couleur moutarde',
        'Semelle épaisse et légère',
      ],
      care:
        'Nettoyez avec un chiffon légèrement humide. Laissez sécher naturellement loin de toute source de chaleur. Utilisez des embauchoirs entre chaque port.',
      colors: [
        color('Noir', '#111111', 'Noir', 5),
        color('Bleu Navy', '#1f2a44', 'Bleu-Navy', 4),
        color('Marron', '#4a3226', 'Marron', 4),
        color('Bleu', '#2f5f9e', 'Bleu', 5),
      ],
      materials: ['Cuir'],
      sizes: SIZES,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      isNewArrival: true,
      isBestseller: false,
      gender: 'homme',
    });

    const saved = await chukka.save();
    console.log('✅ Chukka Grainé added!');
    console.log('Product ID:', saved._id.toString());
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addChukkaGraine();
