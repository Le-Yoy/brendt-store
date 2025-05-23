// scripts/list-products.js
const fs = require('fs');
const path = require('path');

const productsPath = path.resolve(__dirname, '../src/utils/productData.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Create CSV of product info
let output = 'Name,Category,Subcategory,Price,PreviousPrice,Discount\n';
products.forEach(product => {
  output += `"${product.name}","${product.category}","${product.subcategory}",${product.price},${product.previousPrice || ''},${product.discount || ''}\n`;
});

fs.writeFileSync('product-list.csv', output);
console.log(`Saved list of ${products.length} products to product-list.csv`);

// Print simple list to console
console.log('\nAll products:');
products.forEach(p => console.log(`${p.name} (${p.category}/${p.subcategory})`));