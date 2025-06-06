const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brendt';

// Import Product model
const Product = require('../models/Product');

// Women's products to import
const womenProducts = [
  {
    name: "Babouches Classiques",
    price: 850,
    previousPrice: 950,
    discount: 10,
    category: "chaussures",
    categoryName: "Chaussures",
    subcategory: "babouches",
    subcategoryName: "Babouches",
    description: "Babouches traditionnelles marocaines, confectionnées à la main avec un savoir-faire artisanal.",
    details: [
      "Cuir véritable",
      "Semelle en cuir",
      "Fabrication artisanale",
      "Made in Morocco"
    ],
    care: "Nettoyer avec un chiffon doux. Éviter l'eau et les produits chimiques.",
    colors: [
      {
        name: "Beige",
        code: "#E8DCCA",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Beige/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Beige/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Beige/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Beige/4.jpg"
        ]
      },
      {
        name: "Bleu",
        code: "#2E5090",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/4.jpg"
        ]
      },
      {
        name: "Taupe",
        code: "#8B7D6B",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/4.jpg"
        ]
      }
    ],
    materials: ["Cuir de veau", "Semelle en cuir"],
    sizes: [
      { name: "36", eu: "36", uk: "3", us: "5", available: true },
      { name: "37", eu: "37", uk: "4", us: "6", available: true },
      { name: "38", eu: "38", uk: "5", us: "7", available: true },
      { name: "39", eu: "39", uk: "6", us: "8", available: true },
      { name: "40", eu: "40", uk: "7", us: "9", available: true }
    ],
    rating: 4.7,
    reviewCount: 18,
    inStock: true,
    isNewArrival: false,
    isBestseller: true,
    gender: "femme"
  },
  {
    name: "Tangier Walk",
    price: 1250,
    previousPrice: null,
    discount: null,
    category: "chaussures",
    categoryName: "Chaussures",
    subcategory: "mocassinos",
    subcategoryName: "Mocassins",
    description: "Mocassins élégants inspirés par la ville de Tanger, combinant confort et style pour une allure sophistiquée.",
    details: [
      "Cuir de veau premium",
      "Doublure en cuir",
      "Semelle en caoutchouc souple",
      "Finitions à la main"
    ],
    care: "Nettoyer avec un chiffon doux. Utiliser une crème nourrissante pour cuir pour maintenir la souplesse.",
    colors: [
      {
        name: "Beige",
        code: "#E8DCCA",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Beige/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Beige/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Beige/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Beige/4.webp"
        ]
      },
      {
        name: "Gris",
        code: "#808080",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/4.webp"
        ]
      },
      {
        name: "Vert",
        code: "#2F4F4F",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/4.webp"
        ]
      }
    ],
    materials: ["Cuir de veau", "Doublure en cuir", "Semelle en caoutchouc"],
    sizes: [
      { name: "36", eu: "36", uk: "3", us: "5", available: true },
      { name: "37", eu: "37", uk: "4", us: "6", available: true },
      { name: "38", eu: "38", uk: "5", us: "7", available: true },
      { name: "39", eu: "39", uk: "6", us: "8", available: true },
      { name: "40", eu: "40", uk: "7", us: "9", available: true }
    ],
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    gender: "femme"
  },
  {
    name: "Tangier Walk Pompom",
    price: 1350,
    previousPrice: 1500,
    discount: 10,
    category: "chaussures",
    categoryName: "Chaussures",
    subcategory: "mocassinos",
    subcategoryName: "Mocassins",
    description: "Version élégante des mocassins Tangier Walk, ornés de pompons décoratifs pour une touche de sophistication supplémentaire.",
    details: [
      "Cuir de veau premium",
      "Doublure en cuir",
      "Pompons décoratifs",
      "Semelle en caoutchouc souple",
      "Finitions à la main"
    ],
    care: "Nettoyer avec un chiffon doux. Utiliser une crème nourrissante pour cuir pour maintenir la souplesse.",
    colors: [
      {
        name: "Amande",
        code: "#EFDECD",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Amande/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Amande/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Amande/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Amande/4.webp"
        ]
      },
      {
        name: "Bleu Ciel",
        code: "#87CEEB",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/4.webp"
        ]
      },
      {
        name: "Marron",
        code: "#964B00",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/4.webp"
        ]
      }
    ],
    materials: ["Cuir de veau", "Doublure en cuir", "Semelle en caoutchouc"],
    sizes: [
      { name: "36", eu: "36", uk: "3", us: "5", available: true },
      { name: "37", eu: "37", uk: "4", us: "6", available: true },
      { name: "38", eu: "38", uk: "5", us: "7", available: true },
      { name: "39", eu: "39", uk: "6", us: "8", available: true },
      { name: "40", eu: "40", uk: "7", us: "9", available: true }
    ],
    rating: 4.9,
    reviewCount: 32,
    inStock: true,
    isNewArrival: true,
    isBestseller: true,
    gender: "femme"
  }
];

async function importWomenProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check for existing women's products
    const existingFemmeProducts = await Product.countDocuments({ gender: 'femme' });
    console.log(`Found ${existingFemmeProducts} existing women's products`);
    
    // Delete existing women's products to avoid duplicates
    await Product.deleteMany({ gender: 'femme' });
    console.log('Removed existing women products');
    
    // Import new women's products
    const result = await Product.insertMany(womenProducts);
    console.log(`Successfully imported ${result.length} women's products`);
    
    // Verify by subcategory
    const babouchesCount = await Product.countDocuments({ subcategory: 'babouches' });
    const mocassinosCount = await Product.countDocuments({ subcategory: 'mocassinos' });
    
    console.log(`Imported ${babouchesCount} babouches products`);
    console.log(`Imported ${mocassinosCount} mocassinos products`);
    
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the import
importWomenProducts();