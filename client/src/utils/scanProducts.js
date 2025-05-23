// This script scans the product directories and generates mock data
const fs = require('fs');
const path = require('path');

// Define project root path - adjust this to your actual project path
const projectRoot = path.resolve(process.cwd());
console.log('Project root path:', projectRoot);

// Base paths to scan - using absolute paths to avoid any confusion
const basePaths = [
  path.join(projectRoot, 'public', 'assets', 'images', 'products', 'brendt-new', 'Homme', 'Shoes'),
  path.join(projectRoot, 'public', 'assets', 'images', 'products', 'brendt-new', 'Homme', 'Accessoires')
];

// Log the paths we're going to scan
console.log('Paths to scan:');
basePaths.forEach(p => console.log(p));

// Categories mapping (based on folder structure)
const categoryMapping = {
  'Shoes': 'shoes',
  'Accessoires': 'accessories'
};

// Function to get all products from the directories
function scanProducts() {
  let products = [];
  let id = 1;

  // For each base path
  basePaths.forEach(basePath => {
    try {
      console.log(`Checking if path exists: ${basePath}`);
      if (!fs.existsSync(basePath)) {
        console.log(`Path does not exist: ${basePath}`);
        return; // Skip this path
      }
      
      const category = path.basename(basePath);
      const categoryId = categoryMapping[category] || category.toLowerCase();
      
      console.log(`Scanning directory: ${basePath}`);
      // Get all product folders
      const productFolders = fs.readdirSync(basePath);
      console.log(`Found ${productFolders.length} potential product folders in ${category}`);
      
      productFolders.forEach(productFolder => {
        const productPath = path.join(basePath, productFolder);
        
        // Check if it's a directory
        if (fs.statSync(productPath).isDirectory()) {
          console.log(`Scanning product folder: ${productFolder}`);
          // Get all image files
          const imageFiles = fs.readdirSync(productPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => `/${path.relative(path.join(projectRoot, 'public'), path.join(productPath, file)).replace(/\\/g, '/')}`);
          
          if (imageFiles.length > 0) {
            console.log(`Found ${imageFiles.length} images for product ${productFolder}`);
            // Generate a product from the folder name and images
            const product = generateProductFromImages(id, productFolder, categoryId, imageFiles);
            products.push(product);
            id++;
          } else {
            console.log(`No image files found in ${productFolder}`);
            
            // Check for nested directories
            const nestedFolders = fs.readdirSync(productPath)
              .filter(item => fs.statSync(path.join(productPath, item)).isDirectory());
            
            if (nestedFolders.length > 0) {
              console.log(`Found ${nestedFolders.length} nested folders, checking for images...`);
              
              // Find images in nested folders (for color variants)
              const colorVariants = [];
              
              nestedFolders.forEach(colorFolder => {
                const colorPath = path.join(productPath, colorFolder);
                const colorImages = fs.readdirSync(colorPath)
                  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
                  .map(file => `/${path.relative(path.join(projectRoot, 'public'), path.join(colorPath, file)).replace(/\\/g, '/')}`);
                
                if (colorImages.length > 0) {
                  console.log(`Found ${colorImages.length} images for color ${colorFolder}`);
                  colorVariants.push({
                    name: colorFolder.replace(/-/g, ' ').replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase()),
                    code: getColorCode(colorFolder),
                    images: colorImages
                  });
                }
              });
              
              if (colorVariants.length > 0) {
                // Create a product with color variants
                const product = generateProductWithColorVariants(id, productFolder, categoryId, colorVariants);
                products.push(product);
                id++;
              }
            }
          }
        } else {
          console.log(`Skipping non-directory: ${productFolder}`);
        }
      });
    } catch (error) {
      console.error(`Error scanning directory ${basePath}:`, error);
    }
  });

  return products;
}

// Map common color names to hex codes
function getColorCode(colorName) {
  const colorMap = {
    'black': '#000000',
    'brown': '#8B4513',
    'tan': '#D2B48C',
    'navy': '#000080',
    'burgundy': '#800020',
    'grey': '#808080',
    'green': '#006400',
    'blue': '#0000CD',
    'red': '#B22222',
    'white': '#FFFFFF',
    'beige': '#F5F5DC'
  };
  
  const lowerColor = colorName.toLowerCase();
  
  // Find a matching color
  for (const [name, code] of Object.entries(colorMap)) {
    if (lowerColor.includes(name)) {
      return code;
    }
  }
  
  // Default color if no match
  return '#000000';
}

// Function to generate a product object from images
function generateProductFromImages(id, name, category, images) {
  // Clean up the product name (replace dashes with spaces, capitalize)
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
  
  // Create mock details
  const details = [
    'Premium full-grain leather',
    'Hand-finished detailing',
    'Leather sole with rubber inserts for durability',
    'Cushioned insole for all-day comfort',
    'Made in Italy'
  ];
  
  // Default care instructions
  const care = 'Clean with a soft cloth. Apply premium leather conditioner regularly. Store with shoe trees. Avoid prolonged exposure to direct sunlight.';
  
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

// Function to generate a product with color variants
function generateProductWithColorVariants(id, name, category, colorVariants) {
  // Base product
  const product = generateProductFromImages(id, name, category, []);
  
  // Replace the colors array with our color variants
  product.colors = colorVariants;
  
  return product;
}

// Generate the products and save to a file
console.log('Starting product scan...');
const products = scanProducts();
console.log(`Generated data for ${products.length} products.`);

// Create output file
const outputFile = path.join(projectRoot, 'src', 'utils', 'productData.json');
console.log(`Writing output to: ${outputFile}`);
fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));

console.log('Product data generation complete!');