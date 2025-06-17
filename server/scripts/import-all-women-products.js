const mongoose = require('mongoose');

// Hardcoded MongoDB URI for production
const MONGODB_URI = "mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy";

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  previousPrice: { type: Number },
  discount: { type: Number },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  subcategory: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  description: { type: String, required: true },
  details: [String],
  care: String,
  colors: [{
    name: String,
    code: String,
    images: [String],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 }
  }],
  materials: [String],
  sizes: [{
    name: String,
    eu: String,
    uk: String,
    us: String,
    available: { type: Boolean, default: true }
  }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  gender: { type: String, required: true, enum: ['homme', 'femme'] }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// COMPLETE WOMEN'S PRODUCTS - ALL SUBCATEGORIES
const allWomenProducts = [
  // 1. BABOUCHES
  {
    name: "Babouches",
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
        ],
        inStock: true,
        stock: 15
      },
      {
        name: "Bleu",
        code: "#2E5090",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu/4.jpg"
        ],
        inStock: true,
        stock: 12
      },
      {
        name: "Bleu Clair",
        code: "#ADD8E6",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu-Clair/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu-Clair/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu-Clair/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Bleu-Clair/4.jpg"
        ],
        inStock: true,
        stock: 10
      },
      {
        name: "Gris",
        code: "#808080",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Gris/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Gris/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Gris/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Gris/4.jpg"
        ],
        inStock: true,
        stock: 8
      },
      {
        name: "Noir",
        code: "#000000",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Noir/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Noir/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Noir/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Noir/4.jpg"
        ],
        inStock: true,
        stock: 18
      },
      {
        name: "Rose",
        code: "#FFC0CB",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Rose/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Rose/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Rose/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Rose/4.jpg"
        ],
        inStock: true,
        stock: 14
      },
      {
        name: "Taupe",
        code: "#8B7D6B",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/1.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/2.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/3.jpg",
          "/assets/images/products/brendt-new/Femme/chaussures/babouches/Taupe/4.jpg"
        ],
        inStock: true,
        stock: 6
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

  // 2. TANGIER WALK (Regular)
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
        ],
        inStock: true,
        stock: 12
      },
      {
        name: "Gris",
        code: "#808080",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Gris/4.webp"
        ],
        inStock: true,
        stock: 8
      },
      {
        name: "Vert",
        code: "#2F4F4F",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk/Vert/4.webp"
        ],
        inStock: true,
        stock: 6
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

  // 3. TANGIER WALK POMPOM
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
        ],
        inStock: true,
        stock: 10
      },
      {
        name: "Bleu Ciel",
        code: "#87CEEB",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Bleu-Ciel/4.webp"
        ],
        inStock: true,
        stock: 7
      },
      {
        name: "Gris",
        code: "#808080",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Gris/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Gris/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Gris/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Gris/4.webp"
        ],
        inStock: true,
        stock: 9
      },
      {
        name: "Marron",
        code: "#964B00",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/mocassinos/Tangier-Walk-Pompom/Marron/4.webp"
        ],
        inStock: true,
        stock: 11
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
  },

  // 4. SANDALES (MISSING PRODUCT - RECREATED)
  {
    name: "Summer Sandales",
    price: 750,
    previousPrice: 890,
    discount: 16,
    category: "chaussures",
    categoryName: "Chaussures",
    subcategory: "sandales",
    subcategoryName: "Sandales",
    description: "Sandales d'été élégantes en cuir véritable, parfaites pour les journées ensoleillées avec un style raffiné.",
    details: [
      "Cuir véritable haute qualité",
      "Semelle confortable",
      "Fermeture ajustable",
      "Design élégant et moderne"
    ],
    care: "Nettoyer avec un chiffon humide. Éviter l'exposition prolongée au soleil.",
    colors: [
      {
        name: "Camel",
        code: "#C19A6B",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Camel/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Camel/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Camel/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Camel/4.webp"
        ],
        inStock: true,
        stock: 15
      },
      {
        name: "Blanc",
        code: "#FFFFFF",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Blanc/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Blanc/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Blanc/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Blanc/4.webp"
        ],
        inStock: true,
        stock: 12
      },
      {
        name: "Noir",
        code: "#000000",
        images: [
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Noir/1.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Noir/2.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Noir/3.webp",
          "/assets/images/products/brendt-new/Femme/chaussures/sandales/Summer-Sandales/Noir/4.webp"
        ],
        inStock: true,
        stock: 18
      }
    ],
    materials: ["Cuir véritable", "Semelle synthétique"],
    sizes: [
      { name: "36", eu: "36", uk: "3", us: "5", available: true },
      { name: "37", eu: "37", uk: "4", us: "6", available: true },
      { name: "38", eu: "38", uk: "5", us: "7", available: true },
      { name: "39", eu: "39", uk: "6", us: "8", available: true },
      { name: "40", eu: "40", uk: "7", us: "9", available: true },
      { name: "41", eu: "41", uk: "8", us: "10", available: true }
    ],
    rating: 4.5,
    reviewCount: 27,
    inStock: true,
    isNewArrival: false,
    isBestseller: false,
    gender: "femme"
  }
];

async function importAllWomenProducts() {
  try {
    console.log('🚀 Starting complete women\'s products import...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas (Production)');

    // Check existing products
    const existingCount = await Product.countDocuments({ gender: 'femme' });
    console.log(`📊 Found ${existingCount} existing women's products`);

    // Clear all women's products first (one-time clean slate)
    const deleteResult = await Product.deleteMany({ gender: 'femme' });
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing women's products`);

    // Import all women's products
    const importResult = await Product.insertMany(allWomenProducts);
    console.log(`✅ Successfully imported ${importResult.length} women's products`);

    // Verify by subcategory
    const verification = await Product.aggregate([
      { $match: { gender: 'femme' } },
      { 
        $group: { 
          _id: '$subcategory', 
          count: { $sum: 1 },
          products: { $push: '$name' }
        } 
      }
    ]);

    console.log('\n📋 VERIFICATION REPORT:');
    verification.forEach(category => {
      console.log(`   ${category._id}: ${category.count} products`);
      category.products.forEach(name => console.log(`     - ${name}`));
    });

    const totalFinal = await Product.countDocuments({ gender: 'femme' });
    console.log(`\n🎯 FINAL COUNT: ${totalFinal} women's products in database`);
    
    console.log('\n🌟 Import completed successfully!');
    console.log('🔗 Check your website: https://brendt-store.vercel.app');

  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

importAllWomenProducts();