// scripts/manage-prices.js
const fs = require('fs');
const path = require('path');

const productsPath = path.resolve(__dirname, '../src/utils/productData.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Price configuration by category and product - ALL WITH DISCOUNTS
// Prices in MAD (Moroccan Dirham)
const priceUpdates = [
  // CHAUSSURES - BOOTS
  { name: "Boots Cuir", regularPrice: 3900, discount: 15 },
  { name: "Boots Daim", regularPrice: 4200, discount: 20 },
  { name: "Chic Modernes Boucle", regularPrice: 4500, discount: 10 },
  { name: "Chic Urbain Cuir Bottines", regularPrice: 3800, discount: 12 },
  { name: "ÉMinence Unique Boots", regularPrice: 5200, discount: 15 },
  { name: "Explorer ÉLite Boots", regularPrice: 4800, discount: 8 },
  { name: "Hugo éLéGance Souple CrêPier", regularPrice: 3700, discount: 20 },
  { name: "Hugo éLéGance Souple Cuir", regularPrice: 4100, discount: 10 },
  { name: "Hugo éLéGance Souple Daim", regularPrice: 4300, discount: 12 },
  { name: "Montagne Luxe Bottine", regularPrice: 5500, discount: 15 },
  
  // CHAUSSURES - DERBIES
  { name: "Aby", regularPrice: 3600, discount: 10 },
  { name: "Canet", regularPrice: 3900, discount: 15 },
  { name: "Chad", regularPrice: 3700, discount: 8 },
  { name: "Cuir", regularPrice: 3500, discount: 10 },
  { name: "Daim", regularPrice: 3800, discount: 12 },
  { name: "Diken", regularPrice: 4100, discount: 15 },
  { name: "Ley", regularPrice: 3600, discount: 10 },
  { name: "Pablo", regularPrice: 3900, discount: 10 },
  { name: "Robin", regularPrice: 4200, discount: 12 },
  { name: "Sunny", regularPrice: 3700, discount: 15 },
  { name: "Brogue", regularPrice: 4000, discount: 10 },
  { name: "Cuir Veau", regularPrice: 4300, discount: 10 },
  { name: "L'Unique", regularPrice: 4600, discount: 8 },
  { name: "Rome", regularPrice: 3800, discount: 15 },
  { name: "Turin", regularPrice: 4100, discount: 12 },
  { name: "Vienne", regularPrice: 4400, discount: 10 },
  
  // CHAUSSURES - MOCASSINS
  { name: "Agafay Walk", regularPrice: 3200, discount: 8 },
  { name: "Classico Mocassin", regularPrice: 3500, discount: 15 },
  { name: "Gomme Mocassin Cuir", regularPrice: 3800, discount: 10 },
  { name: "Gomme Mocassin Daim", regularPrice: 4100, discount: 10 },
  { name: "L'Unique Mocassin Cuir", regularPrice: 4400, discount: 12 },
  { name: "L'Unique Mocassin Daim", regularPrice: 4700, discount: 15 },
  { name: "George Washington", regularPrice: 3900, discount: 8 },
  { name: "Carshoe", regularPrice: 4200, discount: 10 },
  { name: "Day", regularPrice: 3600, discount: 12 },
  { name: "Pampillou", regularPrice: 3300, discount: 15 },
  { name: "Scal", regularPrice: 3500, discount: 10 },
  { name: "Scal Cuir", regularPrice: 3800, discount: 10 },
  { name: "Unique Cuir", regularPrice: 4100, discount: 8 },
  { name: "à Gland", regularPrice: 4400, discount: 15 },
  { name: "Penny Loafer", regularPrice: 3700, discount: 12 },
  
  // CHAUSSURES - SNEAKERS
  { name: "Cerfy Sneaker", regularPrice: 2800, discount: 20 },
  { name: "Dam Sneaker", regularPrice: 3100, discount: 15 },
  { name: "Barcelone", regularPrice: 2900, discount: 15 },
  { name: "Cy", regularPrice: 3300, discount: 10 },
  { name: "DDBO", regularPrice: 3600, discount: 10 },
  { name: "Daim Latex", regularPrice: 3200, discount: 12 },
  { name: "Eva", regularPrice: 2700, discount: 15 },
  { name: "Flexy Walk", regularPrice: 3000, discount: 8 },
  { name: "Jhonny", regularPrice: 3300, discount: 10 },
  { name: "Nubuck", regularPrice: 3600, discount: 12 },
  { name: "Rome", regularPrice: 2800, discount: 15 },
  { name: "Street", regularPrice: 3100, discount: 10 },
  { name: "Veau", regularPrice: 3400, discount: 10 },
  { name: "Stitch", regularPrice: 3700, discount: 8 },
  { name: "Triple Stitch", regularPrice: 4000, discount: 15 },
  { name: "Snow Sneaker", regularPrice: 3500, discount: 12 },
  { name: "Suede Sneaker", regularPrice: 3200, discount: 10 },
  
  // ACCESSOIRES
  { name: "Trousse De Toilettes", regularPrice: 1800, discount: 15 },
  
  // Default prices for any products not listed above - ALL WITH DISCOUNTS
  { category: "chaussures", subcategory: "boots", defaultPrice: 4000, defaultDiscount: 10 },
  { category: "chaussures", subcategory: "derbies", defaultPrice: 3700, defaultDiscount: 12 },
  { category: "chaussures", subcategory: "mocassins", defaultPrice: 3500, defaultDiscount: 15 },
  { category: "chaussures", subcategory: "sneaker", defaultPrice: 3000, defaultDiscount: 10 },
  { category: "accessoires", defaultPrice: 1800, defaultDiscount: 15 },
  { category: "pret-a-porter", defaultPrice: 3500, defaultDiscount: 12 }
];

// Ensure ALL products have discounts
// Modify any product without a specific rule to get a random discount
const ensureAllProductsHaveDiscounts = () => {
  // Create discount generator function
  const generateDiscount = () => {
    const discounts = [8, 10, 12, 15, 20]; // Common discount percentages
    return discounts[Math.floor(Math.random() * discounts.length)];
  };
  
  // For products not in priceUpdates, give them base prices and discounts
  products.forEach(product => {
    const exactMatch = priceUpdates.find(u => 
      u.name && product.name && u.name.toLowerCase() === product.name.toLowerCase()
    );
    
    if (!exactMatch) {
      // Add a price rule for this product
      const basePrice = 3000 + Math.floor(Math.random() * 2000); // 3000-5000 MAD
      priceUpdates.push({
        name: product.name,
        regularPrice: basePrice, 
        discount: generateDiscount()
      });
    }
  });
};

// Make sure ALL products have discounts
ensureAllProductsHaveDiscounts();

// Count of products updated
let updatedCount = 0;
let missingCount = 0;

// Apply price updates
products.forEach(product => {
  // Look for exact product match
  const exactUpdate = priceUpdates.find(u => 
    u.name && product.name && u.name.toLowerCase() === product.name.toLowerCase()
  );
  
  if (exactUpdate) {
    // Apply exact product price with discount (ALL products have discounts now)
    updateProductPrice(product, exactUpdate);
    updatedCount++;
  } else {
    // Apply default price for category/subcategory - with discount
    const categoryDefault = priceUpdates.find(u => 
      u.category === product.category && 
      (!u.subcategory || u.subcategory === product.subcategory) &&
      u.defaultPrice
    );
    
    if (categoryDefault) {
      updateProductPrice(product, {
        regularPrice: categoryDefault.defaultPrice,
        discount: categoryDefault.defaultDiscount
      });
      updatedCount++;
    } else {
      console.log(`No price rule found for: ${product.name} (${product.category}/${product.subcategory})`);
      
      // Apply a fallback price with discount to ensure ALL products have discounted prices
      updateProductPrice(product, {
        regularPrice: 3500,
        discount: 10 // Default 10% discount
      });
      
      missingCount++;
    }
  }
});

// Helper function to update a product's price
function updateProductPrice(product, update) {
  // Ensure ALL products have a discount (no null discounts)
  const discount = update.discount || 10; // Default 10% if no discount specified
  
  product.previousPrice = update.regularPrice;
  product.price = Math.round(update.regularPrice * (1 - discount/100));
  product.discount = discount;
}

// Save updated products back to file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`Prices updated successfully - ${updatedCount} products updated, ${missingCount} products had no matching price rule`);
console.log('ALL products now have discounts with strikethrough prices!');