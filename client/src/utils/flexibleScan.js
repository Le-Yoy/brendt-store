// This script recursively scans for product images and generates data
const fs = require('fs');
const path = require('path');

// Define project root path
const projectRoot = path.resolve(process.cwd());
console.log('Project root path:', projectRoot);

// Base image directory
const baseImageDir = path.join(projectRoot, 'public', 'assets', 'images', 'products');
console.log(`Base image directory: ${baseImageDir}`);

// Categories mapping
const categoryMapping = {
  'Shoes': 'shoes',
  'Accessoires': 'accessories',
  'Homme': 'homme',
  'Femme': 'femme'
};

// Function to recursively find image folders
function findImageFolders(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return [];
  
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return [];
  }
  
  let imageFolders = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    // Check if this directory contains images directly
    const imageFiles = items.filter(item => /\.(jpg|jpeg|png|webp)$/i.test(item));
    if (imageFiles.length > 0) {
      console.log(`Found ${imageFiles.length} images in ${dir}`);
      imageFolders.push({
        path: dir,
        images: imageFiles.map(file => path.join(dir, file)),
        name: path.basename(dir)
      });
      return imageFolders; // Don't recurse further if we found images
    }
    
    // Otherwise, check subdirectories
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const subFolders = findImageFolders(itemPath, depth + 1, maxDepth);
        imageFolders = imageFolders.concat(subFolders);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return imageFolders;
}

// Function to determine category from path
function determineCategory(folderPath) {
  const pathParts = folderPath.split(path.sep);
  
  for (const part of pathParts) {
    if (categoryMapping[part]) {
      return categoryMapping[part];
    }
  }
  
  // Default to the parent folder name
  const parentName = path.basename(path.dirname(folderPath)).toLowerCase();
  return parentName;
}

// Function to convert relative image paths to web URLs
function convertToWebPath(imagePath) {
  // Get path relative to public directory
  const relativePath = path.relative(
    path.join(projectRoot, 'public'),
    imagePath
  );
  
  // Convert to web URL format
  return '/' + relativePath.replace(/\\/g, '/');
}

// Function to generate a product from folder info
function generateProduct(id, folderInfo) {
  // Clean up the product name
  const cleanName = folderInfo.name
    .replace(/-/g, ' ')
    .replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase());
  
  // Determine category
  const category = determineCategory(folderInfo.path);
  
  // Convert image paths to web URLs
  const imageUrls = folderInfo.images.map(img => convertToWebPath(img));
  
  // Generate random product data
  const price = Math.floor(Math.random() * 900) + 300;
  const hasDiscount = Math.random() < 0.3;
  const discount = hasDiscount ? Math.floor(Math.random() * 20) + 10 : null;
  const previousPrice = hasDiscount ? Math.floor(price * (100 / (100 - discount))) : null;
  
  return {
    id: String(id),
    name: cleanName,
    price: price,
    previousPrice: previousPrice,
    discount: discount,
    category: category,
    description: `Crafted with premium materials, the ${cleanName} exemplifies the BRENDT-PROJECT commitment to timeless luxury and exquisite craftsmanship.`,
    details: [
      'Premium full-grain leather',
      'Hand-finished detailing',
      'Leather sole with rubber inserts for durability',
      'Cushioned insole for all-day comfort',
      'Made in Italy'
    ],
    care: 'Clean with a soft cloth. Apply premium leather conditioner regularly. Store with shoe trees. Avoid prolonged exposure to direct sunlight.',
    colors: [
      { name: 'Default', code: '#000000', images: imageUrls }
    ],
    sizes: [
      { eu: '39', uk: '5', us: '6', available: true },
      { eu: '40', uk: '6', us: '7', available: true },
      { eu: '41', uk: '7', us: '8', available: true },
      { eu: '42', uk: '8', us: '9', available: true },
      { eu: '43', uk: '9', us: '10', available: true },
      { eu: '44', uk: '10', us: '11', available: true },
      { eu: '45', uk: '11', us: '12', available: Math.random() > 0.3 },
      { eu: '46', uk: '12', us: '13', available: Math.random() > 0.6 }
    ],
    rating: (Math.random() * 1.3 + 3.7).toFixed(1),
    reviewCount: Math.floor(Math.random() * 150) + 10,
    inStock: true,
    isNewArrival: Math.random() < 0.2,
    isBestseller: Math.random() < 0.15
  };
}

// Main function
function generateProductData() {
  console.log('Starting flexible product scan...');
  
  // Find all image folders
  const imageFolders = findImageFolders(baseImageDir);
  console.log(`Found ${imageFolders.length} image folders`);
  
  // Generate products
  const products = [];
  imageFolders.forEach((folder, index) => {
    const product = generateProduct(index + 1, folder);
    products.push(product);
  });
  
  // Save to file
  const outputFile = path.join(projectRoot, 'src', 'utils', 'productData.json');
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
  
  console.log(`Generated data for ${products.length} products.`);
  console.log(`Data saved to ${outputFile}`);
}

// Run the generator
generateProductData();