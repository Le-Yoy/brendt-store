const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const sandalesProducts = [
  {
    name: "Sandales Tarhazout",
    price: 950,
    previousPrice: 1100,
    discount: 14,
    category: "chaussures",
    categoryName: "Chaussures", 
    subcategory: "sandales",
    subcategoryName: "Sandales",
    gender: "femme",
    description: "Sandales artisanales en raffia naturel, parfaites pour l'été.",
    details: ["Raffia naturel", "Semelle confortable", "Made in Morocco"],
    care: "Nettoyer délicatement à sec",
    colors: [
      {
        name: "Raffia-Blanc",
        code: "#F5F5DC",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Blanc/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Blanc/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Blanc/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Blanc/4.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Blanc/5.webp"
        ]
      },
      {
        name: "Raffia-Naturel", 
        code: "#D2B48C",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Naturel/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Naturel/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Naturel/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Naturel/4.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Sandales Tarhazout/Raffia-Naturel/5.webp"
        ]
      }
    ],
    sizes: [
      { name: "36", eu: "36", uk: "3", us: "5", available: true },
      { name: "37", eu: "37", uk: "4", us: "6", available: true },
      { name: "38", eu: "38", uk: "5", us: "7", available: true },
      { name: "39", eu: "39", uk: "6", us: "8", available: true },
      { name: "40", eu: "40", uk: "7", us: "9", available: true },
      { name: "41", eu: "41", uk: "8", us: "10", available: true }
    ],
    inStock: true,
    featured: false,
    trending: false
  }
];

async function addSandales() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if sandales already exist
    const existing = await Product.find({ subcategory: 'sandales' });
    if (existing.length > 0) {
      console.log('Sandales already exist! Skipping...');
      process.exit(0);
    }
    
    // Add sandales only
    await Product.insertMany(sandalesProducts);
    console.log('✅ Added sandales successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSandales();
