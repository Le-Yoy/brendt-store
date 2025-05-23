// scripts/run-scanner.js
const { scanHommeProducts, scanFemmeProducts } = require('../src/utils/brendtProductScanner');
const fs = require('fs');
const path = require('path');

console.log('Starting product scanner...');

// Scan both men's and women's products
console.log('Scanning men\'s products...');
const hommeProducts = scanHommeProducts();
console.log(`Found ${hommeProducts.length} men's products`);

console.log('Scanning women\'s products...');
const femmeProducts = scanFemmeProducts();
console.log(`Found ${femmeProducts.length} women's products`);

// Combine all products
const allProducts = [...hommeProducts, ...femmeProducts];
console.log(`Total products: ${allProducts.length}`);

// Save to JSON file
const outputPath = path.resolve(__dirname, '../src/utils/productData.json');
fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');

console.log(`Products saved to: ${outputPath}`);