// Script to scan Homme products with fixed directory handling
const fs = require('fs');
const path = require('path');

// Define project root path
const projectRoot = path.resolve(process.cwd());
console.log('Project root path:', projectRoot);

// Path to brendt-new directory (parent of Homme)
const brendtDir = path.join(projectRoot, 'public', 'assets', 'images', 'products', 'brendt-new');
console.log(`Brendt-new directory path: ${brendtDir}`);

// First, let's find the exact name of the Homme directory
function findExactDirectoryName(parentDir, targetName) {
  if (!fs.existsSync(parentDir)) {
    console.log(`Parent directory does not exist: ${parentDir}`);
    return null;
  }
  
  try {
    const items = fs.readdirSync(parentDir);
    for (const item of items) {
      if (fs.statSync(path.join(parentDir, item)).isDirectory() && 
          item.trim() === targetName.trim()) {
        console.log(`Found exact directory: "${item}"`);
        return item;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${parentDir}:`, error);
  }
  
  console.log(`Could not find directory matching "${targetName}"`);
  return null;
}

// Find the exact Homme directory name
const exactHommeDir = findExactDirectoryName(brendtDir, 'Homme');
if (!exactHommeDir) {
  console.error('Could not find Homme directory. Exiting.');
  process.exit(1);
}

// Now find all subdirectories in the Homme directory
const hommeDir = path.join(brendtDir, exactHommeDir);
console.log(`Using Homme directory: ${hommeDir}`);

// Find all categories in Homme
let hommeCategories = [];
try {
  const items = fs.readdirSync(hommeDir);
  hommeCategories = items.filter(item => {
    const itemPath = path.join(hommeDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== '.DS_Store';
  });
  
  console.log('Found categories:', hommeCategories);
} catch (error) {
  console.error(`Error reading Homme directory ${hommeDir}:`, error);
  process.exit(1);
}

// Map categories to web-friendly names
const categoryMapping = {
  'Shoes': 'shoes',
  'Accessoires': 'accessories',
  'Maroquinerie': 'leather-goods',
  'Prêt à porter 75': 'clothing'
};

// Function to recursively find image files in a directory
function findImageFiles(dir, basePath = '') {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return [];
  }
  
  let results = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      // Skip .DS_Store files
      if (item === '.DS_Store') continue;
      
      const itemPath = path.join(dir, item);
      const itemStat = fs.statSync(itemPath);
      
      if (itemStat.isDirectory()) {
        // Recursively scan subdirectories
        const nestedImages = findImageFiles(itemPath, path.join(basePath, item));
        results = results.concat(nestedImages);
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
        // Found an image file
        results.push({
          fullPath: itemPath,
          relativePath: path.join(basePath, item),
          fileName: item
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return results;
}

// Function to group images by product
function groupImagesByProduct(images) {
  const products = {};
  
  images.forEach(image => {
    // Try to determine product name from path or file name
    const pathParts = image.relativePath.split(path.sep);
    let productName = '';
    
    // If the image is in a subfolder, use that as the product name
    if (pathParts.length > 1) {
      productName = pathParts[pathParts.length - 2];
    } else {
      // Otherwise use the file name without extension as product name
      productName = path.basename(image.fileName, path.extname(image.fileName));
    }
    
    // Clean up product name - remove numbers and special chars at the end
    productName = productName.replace(/[-_]?\d+$/, '').trim();
    
    // Initialize product if it doesn't exist
    if (!products[productName]) {
      products[productName] = [];
    }
    
    // Add web path for the image
    const webPath = '/' + path.relative(
      path.join(projectRoot, 'public'),
      image.fullPath
    ).replace(/\\/g, '/');
    
    products[productName].push(webPath);
  });
  
  return products;
}

// Function to generate a product object from product name and images
function generateProduct(id, name, category, images) {
  // Clean up the product name
  const cleanName = name
    .replace(/-/g, ' ')
    .replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase());

  // Generate a random price between 300 and 1200
  const price = Math.floor(Math.random() * 900) + 300;
  
  // Occasionally add a discount
  const hasDiscount = Math.random() < 0.3;
  const discount = hasDiscount ? Math.floor(Math.random() * 20) + 10 : null;
  const previousPrice = hasDiscount ? Math.floor(price * (100 / (100 - discount))) : null;
  
  // Create basic product description
  const description = `Crafted with premium materials, the ${cleanName} exemplifies the BRENDT-PROJECT commitment to timeless luxury and exquisite craftsmanship.`;
  
  // Create mock details based on category
  let details = [];
  
  if (category === 'shoes') {
    details = [
      'Premium full-grain leather upper',
      'Hand-finished detailing',
      'Leather sole with rubber inserts for durability',
      'Cushioned insole for all-day comfort',
      'Made in Italy'
    ];
  } else if (category === 'accessories') {
    details = [
      'Premium materials',
      'Handcrafted by skilled artisans',
      'Signature BRENDT-PROJECT design',
      'Elegant packaging included',
      'Made in Europe'
    ];
  } else if (category === 'leather-goods') {
    details = [
      'Finest quality leather',
      'Meticulous hand-stitching',
      'Custom metal hardware',
      'Multiple compartments for organization',
      'Discreet logo placement'
    ];
  } else if (category === 'clothing') {
    details = [
      'Premium fabric selection',
      'Tailored fit',
      'Timeless design',
      'Subtle signature detailing',
      'Made in Europe'
    ];
  }
  
  // Default care instructions based on category
  let care = '';
  if (category === 'shoes') {
    care = 'Clean with a soft cloth. Apply premium leather conditioner regularly. Store with shoe trees. Avoid prolonged exposure to direct sunlight.';
  } else if (category === 'accessories') {
    care = 'Store in the dust bag provided when not in use. Avoid exposure to water, heat, and direct sunlight. Clean with a soft, dry cloth.';
  } else if (category === 'leather-goods') {
    care = 'Apply leather conditioner every three months. Store in the dust bag provided. Avoid water, oil, and prolonged sun exposure.';
  } else if (category === 'clothing') {
    care = 'Dry clean only. Store on a quality hanger. Steam rather than iron when possible. Follow care label instructions.';
  }
  
  // Create product object
  return {
    id: String(id),
    name: cleanName,
    price: price,
    previousPrice: previousPrice,
    discount: discount,
    category: category,
    description: description,
    details: details,
    care: care,
    colors: [
      { name: 'Default', code: '#000000', images: images }
    ],
    sizes: category === 'shoes' ? [
      { eu: '39', uk: '5', us: '6', available: true },
      { eu: '40', uk: '6', us: '7', available: true },
      { eu: '41', uk: '7', us: '8', available: true },
      { eu: '42', uk: '8', us: '9', available: true },
      { eu: '43', uk: '9', us: '10', available: true },
      { eu: '44', uk: '10', us: '11', available: true },
      { eu: '45', uk: '11', us: '12', available: Math.random() > 0.3 },
      { eu: '46', uk: '12', us: '13', available: Math.random() > 0.6 }
    ] : [
      { name: 'S', available: true },
      { name: 'M', available: true },
      { name: 'L', available: true },
      { name: 'XL', available: true },
      { name: 'XXL', available: Math.random() > 0.3 }
    ],
    rating: (Math.random() * 1.3 + 3.7).toFixed(1),
    reviewCount: Math.floor(Math.random() * 150) + 10,
    inStock: true,
    isNewArrival: Math.random() < 0.2,
    isBestseller: Math.random() < 0.15
  };
}

// Main function to scan and generate product data
async function generateHommeProducts() {
  console.log('Starting to scan Homme products...');
  
  const allProducts = [];
  let productId = 1;
  
  // Process each category in Homme
  for (const category of hommeCategories) {
    const categoryDir = path.join(hommeDir, category);
    console.log(`Scanning category directory: ${categoryDir}`);
    
    if (fs.existsSync(categoryDir)) {
      // Find all images in this category
      const images = findImageFiles(categoryDir);
      console.log(`Found ${images.length} images in ${category}`);
      
      // Group images by product
      const productGroups = groupImagesByProduct(images);
      console.log(`Grouped into ${Object.keys(productGroups).length} products`);
      
      // Create product objects
      for (const [productName, productImages] of Object.entries(productGroups)) {
        if (productImages.length > 0) {
          const webCategory = categoryMapping[category] || category.toLowerCase();
          const product = generateProduct(productId, productName, webCategory, productImages);
          allProducts.push(product);
          productId++;
        }
      }
    } else {
      console.log(`Category directory does not exist: ${categoryDir}`);
    }
  }
  
  // If we didn't find any products, create some placeholder products
  if (allProducts.length === 0) {
    console.log('No products found. Creating placeholder products...');
    allProducts.push({
      id: "1",
      name: "Heritage Leather Loafer",
      price: 820,
      previousPrice: null,
      discount: null,
      category: "shoes",
      description: "Crafted from premium Italian leather with a hand-polished finish, these timeless loafers feature a traditional penny slot and leather soles. Perfect for both formal and smart-casual occasions.",
      details: [
        "Full-grain Italian calfskin leather",
        "Hand-stitched details",
        "Leather sole with rubber heel insert for durability",
        "Cushioned insole for all-day comfort",
        "Traditional penny slot design",
        "Made in Italy"
      ],
      care: "Clean with a soft, dry cloth. Apply premium leather conditioner regularly. Avoid prolonged exposure to direct sunlight.",
      colors: [
        { name: "Default", code: "#000000", images: ["/assets/images/placeholder.jpg", "/assets/images/placeholder.jpg"] }
      ],
      sizes: [
        { eu: "39", uk: "5", us: "6", available: true },
        { eu: "40", uk: "6", us: "7", available: true },
        { eu: "41", uk: "7", us: "8", available: true },
        { eu: "42", uk: "8", us: "9", available: true },
        { eu: "43", uk: "9", us: "10", available: true },
        { eu: "44", uk: "10", us: "11", available: true },
        { eu: "45", uk: "11", us: "12", available: false },
        { eu: "46", uk: "12", us: "13", available: false }
      ],
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      isNewArrival: false,
      isBestseller: true
    });
    
    allProducts.push({
      id: "2",
      name: "Artisanal Oxford Brogue",
      price: 950,
      previousPrice: 1100,
      discount: 14,
      category: "shoes",
      description: "These handcrafted Oxford brogues represent the pinnacle of shoemaking artistry. Featuring traditional perforated detailing and a sleek silhouette, they offer impeccable style with modern comfort.",
      details: [
        "Premium calfskin upper with brogueing detail",
        "Goodyear welted construction for durability and resoling",
        "Full leather lining",
        "Hand-finished patina",
        "Cork-filled insole that molds to your foot",
        "Handmade in England"
      ],
      care: "Polish regularly with high-quality wax polish. Use cedar shoe trees after each wear. Allow 24 hours between wears.",
      colors: [
        { name: "Default", code: "#D2B48C", images: ["/assets/images/placeholder.jpg", "/assets/images/placeholder.jpg"] }
      ],
      sizes: [
        { eu: "39", uk: "5", us: "6", available: true },
        { eu: "40", uk: "6", us: "7", available: true },
        { eu: "41", uk: "7", us: "8", available: true },
        { eu: "42", uk: "8", us: "9", available: true },
        { eu: "43", uk: "9", us: "10", available: true },
        { eu: "44", uk: "10", us: "11", available: false },
        { eu: "45", uk: "11", us: "12", available: true },
        { eu: "46", uk: "12", us: "13", available: false }
      ],
      rating: 4.9,
      reviewCount: 86,
      inStock: true,
      isNewArrival: false,
      isBestseller: false
    });
  }
  
  console.log(`Generated ${allProducts.length} products`);
  
  // Save to file
  const outputFile = path.join(projectRoot, 'src', 'utils', 'productData.json');
  fs.writeFileSync(outputFile, JSON.stringify(allProducts, null, 2));
  
  console.log(`Saved product data to: ${outputFile}`);
  
  return allProducts;
}

// Run the generator
generateHommeProducts().then(() => {
  console.log('Product generation complete!');
}).catch(error => {
  console.error('Error generating products:', error);
});