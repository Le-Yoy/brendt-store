// Updated brendtProductScanner.js with support for both Homme and Femme products
const fs = require('fs');
const path = require('path');

// Base project path
const PROJECT_ROOT = path.resolve(process.cwd());
console.log('Project root path:', PROJECT_ROOT);

// Path to the product images
const PRODUCTS_BASE_PATH = path.join(PROJECT_ROOT, 'public', 'assets', 'images', 'products', 'brendt-new');
console.log('Products base path:', PRODUCTS_BASE_PATH);

// Paths for men's and women's sections
const HOMME_PATH = path.join(PRODUCTS_BASE_PATH, 'Homme');
const FEMME_PATH = path.join(PRODUCTS_BASE_PATH, 'Femme');
console.log('Scanning men\'s collection at:', HOMME_PATH);
console.log('Scanning women\'s collection at:', FEMME_PATH);

/**
 * Function to scan directory structure and find all product images for a gender
 * @param {string} genderPath - Path to gender directory (Homme or Femme)
 * @param {string} gender - 'homme' or 'femme'
 * @returns {Array} - Array of product objects
 */
function scanProductsByGender(genderPath, gender) {
  console.log(`Scanning ${gender} collection structure...`);
  
  // Validate the gender directory
  if (!fs.existsSync(genderPath)) {
    console.error(`${gender} directory does not exist: ${genderPath}`);
    return [];
  }
  
  const products = [];
  let productId = gender === 'homme' ? 1000 : 2000;
  
  // Scan top-level categories
  try {
    const categoryDirs = fs.readdirSync(genderPath)
      .filter(item => {
        const itemPath = path.join(genderPath, item);
        return fs.statSync(itemPath).isDirectory() && item !== '.DS_Store';
      });
    
    console.log(`Found ${categoryDirs.length} main categories for ${gender}: ${categoryDirs.join(', ')}`);
    
    // Process each category
    for (const categoryDir of categoryDirs) {
      const categoryPath = path.join(genderPath, categoryDir);
      const categoryInfo = CATEGORY_MAPPINGS[categoryDir.trim()] || { 
        id: categoryDir.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
        name: categoryDir.trim(),
        subcategories: {}
      };
      
      console.log(`Processing ${gender} category: ${categoryInfo.name} (${categoryInfo.id})`);
      
      // Scan subcategories
      const subcategoryDirs = fs.readdirSync(categoryPath)
        .filter(item => {
          const itemPath = path.join(categoryPath, item);
          return fs.statSync(itemPath).isDirectory() && item !== '.DS_Store';
        });
      
      console.log(`Found ${subcategoryDirs.length} subcategories in ${categoryInfo.name}`);
      
      // Process each subcategory
      for (const subcategoryDir of subcategoryDirs) {
        const subcategoryPath = path.join(categoryPath, subcategoryDir);
        const subcategoryBaseName = subcategoryDir.replace(/\s+\d+(\s+)?$/, '').trim(); // Remove trailing numbers
        
        const subcategoryInfo = categoryInfo.subcategories[subcategoryDir] || {
          id: subcategoryBaseName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
          name: subcategoryBaseName
        };
        
        console.log(`Processing subcategory: ${subcategoryInfo.name} (${subcategoryInfo.id})`);
        
        // Get all product directories in this subcategory
        const productDirectories = fs.readdirSync(subcategoryPath)
          .filter(item => {
            const itemPath = path.join(subcategoryPath, item);
            return fs.statSync(itemPath).isDirectory() && item !== '.DS_Store';
          });
        
        console.log(`Found ${productDirectories.length} product directories in ${subcategoryInfo.name}`);
        
        // Process each product directory
        for (const productDir of productDirectories) {
          const productPath = path.join(subcategoryPath, productDir);
          console.log(`Processing product: ${productDir}`);
          
          // Look for color variant subdirectories
          const colorDirectories = fs.readdirSync(productPath)
            .filter(item => {
              const itemPath = path.join(productPath, item);
              return fs.statSync(itemPath).isDirectory() && item !== '.DS_Store';
            });
          
          // Array to store color variants for this product
          const colorVariants = [];
          
          // Process each color directory
          for (const colorDir of colorDirectories) {
            const colorPath = path.join(productPath, colorDir);
            console.log(`  Color variant: ${colorDir}`);
            
            // Get images for this color
            const imageFiles = fs.readdirSync(colorPath)
              .filter(item => /\.(jpg|jpeg|png|webp)$/i.test(item))
              .map(item => path.join(colorPath, item));
            
            if (imageFiles.length > 0) {
              // Find color info from mappings
              const lowerColorName = colorDir.toLowerCase();
              let colorInfo = { name: colorDir, code: "#4A4A4A" }; // Default
              
              for (const [key, value] of Object.entries(COLOR_MAPPINGS)) {
                if (lowerColorName === key || lowerColorName.includes(key)) {
                  colorInfo = value;
                  break;
                }
              }
              
              // Convert image paths to web URLs
              const webImagePaths = imageFiles.map(imgPath => {
                const relativePath = path.relative(path.join(PROJECT_ROOT, 'public'), imgPath);
                return '/' + relativePath.replace(/\\/g, '/');
              });
              
              // Add this color variant
              colorVariants.push({
                name: colorInfo.name,
                code: colorInfo.code || "#4A4A4A",
                images: webImagePaths
              });
            }
          }
          
          // If we found color variants, create a product
          if (colorVariants.length > 0) {
            const product = generateProductFromDirectoryName(
              productId,
              productDir,
              categoryInfo.id,
              categoryInfo.name,
              subcategoryInfo.id,
              subcategoryInfo.name,
              colorVariants,
              gender
            );
            
            products.push(product);
            productId++;
          } else {
            console.log(`  Warning: No color variants found for ${productDir}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${gender} directory:`, error);
  }
  
  return products;
}

/**
 * Function to scan homme products (maintained for backwards compatibility)
 */
function scanHommeProducts() {
  return scanProductsByGender(HOMME_PATH, 'homme');
}

/**
 * Function to scan femme products
 */
function scanFemmeProducts() {
  return scanProductsByGender(FEMME_PATH, 'femme');
}

/**
 * Generate a product from directory name and color variants
 */
/**
 * Generate a product from directory name and color variants
 */
function generateProductFromDirectoryName(id, directoryName, categoryId, categoryName, subcategoryId, subcategoryName, colorVariants, gender) {
  // Clean up the product name
  const sophisticatedName = generateSophisticatedName(directoryName);
  
  // Get materials from the name
  const materials = extractMaterialInfo(directoryName);
  
  // Generate price based on category and materials
  const price = generatePrice(categoryId, subcategoryName, materials);
  
  // Randomly determine if there should be a discount
  const hasDiscount = Math.random() < 0.25;
  const discount = hasDiscount ? Math.floor(Math.random() * 15) + 10 : null; // 10-25% discount
  const previousPrice = hasDiscount ? Math.floor(price * (100 / (100 - discount))) : null;
  
  // If no color variants were found, add a default
  if (colorVariants.length === 0) {
    colorVariants.push({
      name: 'Classique',
      code: '#4A4A4A',
      images: ['/assets/images/placeholder.jpg']
    });
  }
  
  // Generate description
  const description = generateDescription(sophisticatedName, categoryId, subcategoryName, materials, colorVariants);
  
  // Generate product details
  const details = generateProductDetails(categoryId, subcategoryName, materials, colorVariants);
  
  // Generate care instructions
  const care = generateCareInstructions(categoryId, materials);
  
  // Generate appropriate sizes
  const sizes = generateSizes(categoryId, subcategoryName, gender);
  
  // Randomize rating and review count for realism
  const rating = (4.0 + (Math.random() * 1.0)).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 150) + 20;
  
  // Create new arrival and bestseller flags
  const isNewArrival = Math.random() < 0.15;
  const isBestseller = Math.random() < 0.20;
  
  // Build the complete product object
  return {
    id: `${gender}-${id}`,
    name: sophisticatedName,
    price: price,
    previousPrice: previousPrice,
    discount: discount,
    category: categoryId,
    categoryName: categoryName,
    subcategory: subcategoryId,
    subcategoryName: subcategoryName,
    description: description,
    details: details,
    care: care,
    colors: colorVariants,
    sizes: sizes,
    materials: materials,
    rating: parseFloat(rating),
    reviewCount: reviewCount,
    inStock: true,
    isNewArrival: isNewArrival,
    isBestseller: isBestseller,
    gender: gender
  };
}

// Main execution function
function main() {
  console.log('Starting BRENDT-PROJECT Product Scanner...');
  
  // Scan both homme and femme products
  const hommeProducts = scanHommeProducts();
  const femmeProducts = scanFemmeProducts();
  
  // Combine products
  const allProducts = [...hommeProducts, ...femmeProducts];
  
  console.log(`Generated data for ${allProducts.length} products (${hommeProducts.length} men's, ${femmeProducts.length} women's).`);
  
  // If no products found, create placeholder products
  if (allProducts.length === 0) {
    console.log('No products found. Creating placeholder products...');
    
    // Create a placeholder for Mocassins
    allProducts.push({
      id: "1",
      name: "Heritage Loafer Prestige",
      price: 820,
      previousPrice: null,
      discount: null,
      category: "chaussures",
      categoryName: "Chaussures",
      subcategory: "mocassins",
      subcategoryName: "Mocassins",
      description: "Ce mocassin raffiné en Cuir incarne l'élégance intemporelle et le savoir-faire exceptionnel de la maison BRENDT. Dotée d'une semelle en cuir cousue à la main et d'une doublure en cuir souple, cette création allie confort exceptionnel et allure sophistiquée.",
      details: [
        "Fabrication artisanale de haute qualité",
        "Fait en Cuir premium",
        "Semelle en cuir cousue à la main",
        "Doublure en cuir souple pour un confort optimal",
        "Mocassin au tombé parfait pour un confort exceptionnel",
        "Fabriqué en Europe par nos artisans d'exception"
      ],
      care: "Nettoyez avec un chiffon doux et sec. Appliquez régulièrement un cirage de qualité adapté à la couleur du cuir. Utilisez des embauchoirs en cèdre entre chaque port pour préserver la forme.",
      colors: [
        {
          name: "Noir",
          code: "#000000",
          images: ["/assets/images/placeholder.jpg", "/assets/images/placeholder.jpg"]
        }
      ],
      materials: ["Cuir"],
      sizes: [
        { name: "40", eu: "40", uk: "6", us: "7", available: true },
        { name: "41", eu: "41", uk: "7", us: "8", available: true },
        { name: "42", eu: "42", uk: "8", us: "9", available: true },
        { name: "43", eu: "43", uk: "9", us: "10", available: true },
        { name: "44", eu: "44", uk: "10", us: "11", available: true },
        { name: "45", eu: "45", uk: "11", us: "12", available: false }
      ],
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      isNewArrival: false,
      isBestseller: true,
      gender: "homme"
    });
    
    // Add other placeholder products as needed...
  }
  
  // Save to file
  const outputFile = path.join(PROJECT_ROOT, 'src', 'utils', 'productData.json');
  fs.writeFileSync(outputFile, JSON.stringify(allProducts, null, 2));
  
  console.log(`Saved product data to: ${outputFile}`);
  console.log('BRENDT-PROJECT Product Scanner completed successfully.');
}

// Category mappings - maintaining French for categories
const CATEGORY_MAPPINGS = {
  'Shoes': {
    id: 'chaussures',
    name: 'Chaussures',
    subcategories: {
      'Boots 20': { id: 'boots', name: 'Boots' },
      'Derbies 29 ': { id: 'derbies', name: 'Derbies' },
      'Mocassins 44': { id: 'mocassins', name: 'Mocassins' },
      'Sneakers 48': { id: 'sneakers', name: 'Sneakers' },
      'Babouches': { id: 'babouches', name: 'Babouches' }
    }
  },
  'Accessoires': {
    id: 'accessoires',
    name: 'Accessoires',
    subcategories: {
      'Casquette H 7': { id: 'casquettes', name: 'Casquettes' },
      'Ceinture H 8': { id: 'ceintures', name: 'Ceintures' },
      'Cravate 12': { id: 'cravates', name: 'Cravates' },
      'Embauchoirs 3': { id: 'embauchoirs', name: 'Embauchoirs' },
      'Écharpes H 6': { id: 'echarpes', name: 'Écharpes' },
      'Gants H 4': { id: 'gants', name: 'Gants' },
      'Papillion 3': { id: 'noeuds-papillon', name: 'Nœuds Papillon' },
      'Petite Maroquennerie 5': { id: 'petite-maroquinerie', name: 'Petite Maroquinerie' }
    }
  },
  'Maroquinerie': {
    id: 'maroquinerie',
    name: 'Maroquinerie',
    subcategories: {}
  },
  'Prêt à porter 75': {
    id: 'pret-a-porter',
    name: 'Prêt à Porter',
    subcategories: {
      'Chemises 21': { id: 'chemises', name: 'Chemises' },
      'Costumes 16': { id: 'costumes', name: 'Costumes' },
      'Polos 8 ': { id: 'polos', name: 'Polos' },
      'Vestes 20': { id: 'vestes', name: 'Vestes' },
      'pontalon 10': { id: 'pantalons', name: 'Pantalons' }
    }
  }
};

// Color mappings
const COLOR_MAPPINGS = {
  'noir': { name: 'Noir', code: '#000000' },
  'black': { name: 'Noir', code: '#000000' },
  'marron': { name: 'Marron', code: '#654321' },
  'brown': { name: 'Marron', code: '#654321' },
  'cognac': { name: 'Cognac', code: '#8B4513' },
  'chocolat': { name: 'Chocolat', code: '#3C280D' },
  'marine': { name: 'Bleu Marine', code: '#000080' },
  'navy': { name: 'Bleu Marine', code: '#000080' },
  'bleu': { name: 'Bleu', code: '#0000FF' },
  'blue': { name: 'Bleu', code: '#0000FF' },
  'beige': { name: 'Beige', code: '#F5F5DC' },
  'blanc': { name: 'Blanc', code: '#FFFFFF' },
  'white': { name: 'Blanc', code: '#FFFFFF' },
  'gris': { name: 'Gris', code: '#808080' },
  'grey': { name: 'Gris', code: '#808080' },
  'vert': { name: 'Vert', code: '#006400' },
  'green': { name: 'Vert', code: '#006400' },
  'kaki': { name: 'Kaki', code: '#6B8E23' },
  'rouge': { name: 'Rouge', code: '#800000' },
  'red': { name: 'Rouge', code: '#800000' },
  'bordeaux': { name: 'Bordeaux', code: '#800020' },
  'rose': { name: 'Rose', code: '#FFC0CB' },
  'pink': { name: 'Rose', code: '#FFC0CB' },
  'poudré': { name: 'Poudré', code: '#F2CFC2' },
  'lavende': { name: 'Lavande', code: '#967BB6' },
  'lavender': { name: 'Lavande', code: '#967BB6' },
  'jaune': { name: 'Jaune', code: '#FFFF00' },
  'yellow': { name: 'Jaune', code: '#FFFF00' },
  'orange': { name: 'Orange', code: '#FFA500' },
  'ocre': { name: 'Ocre', code: '#CC7722' },
  'ivory': { name: 'Ivoire', code: '#FFFFF0' },
  'ivoir': { name: 'Ivoire', code: '#FFFFF0' },
  'camel': { name: 'Camel', code: '#C19A6B' },
  'taupe': { name: 'Taupe', code: '#483C32' },
  'clair': { name: 'Clair', code: '#ADD8E6' } // For "Bleu Clair"
};

// Material mappings
const MATERIAL_MAPPINGS = {
  'cuir': 'Cuir',
  'leather': 'Cuir',
  'daim': 'Daim',
  'suede': 'Daim',
  'velour': 'Velours',
  'velvet': 'Velours',
  'veau': 'Veau',
  'calf': 'Veau',
  'cachemire': 'Cachemire',
  'cashmere': 'Cachemire',
  'cashco': 'Cashco',
  'laine': 'Laine',
  'wool': 'Laine',
  'alpaga': 'Alpaga',
  'alpaca': 'Alpaga',
  'lin': 'Lin',
  'linen': 'Lin',
  'coton': 'Coton',
  'cotton': 'Coton',
  'jersey': 'Jersey',
  'soie': 'Soie',
  'silk': 'Soie',
  'nubuck': 'Nubuck',
  'cerf': 'Cerf',
  'trofeo': 'Trofeo'
};

/**
 * Generate a sophisticated product name from a folder name
 */
function generateSophisticatedName(folderName) {
  // Remove numbers and special characters from the end
  let name = folderName.replace(/[-_]?\d+$/, '').trim();
  
  // Remove underscores and leading/trailing spaces
  name = name.replace(/^[_\s]+|[_\s]+$/g, '');
  
  // Remove any prefix like "Polo en Lin" to get the distinctive part
  const prefixPattern = /^(Polo|Chemise|Chaussure|Sneaker|Derby|Mocassin|Veste|Blazer|Ceinture|Costume|Cravate|Pantalon|Écharpe|Loafer|Richelieu|Gant|Chelsea|Boot|Babouche)(s)?(\sen\s|\s)?/i;
  const prefix = name.match(prefixPattern);
  
  let distinctivePart = prefix ? name.replace(prefixPattern, '') : name;
  
  // Clean up the distinctive part
  distinctivePart = distinctivePart.replace(/[-_]/g, ' ').trim();
  
  // Capitalize each word
  distinctivePart = distinctivePart.replace(/\b\w/g, c => c.toUpperCase());
  
  // If the name still has prefixes like "en" or spaces, clean them up
  distinctivePart = distinctivePart.replace(/^En\s+/i, '');
  
  // If it's a color-only name, enhance it
  const isJustColor = Object.keys(COLOR_MAPPINGS).some(color => 
    distinctivePart.toLowerCase().includes(color) && distinctivePart.split(/\s+/).length <= 2
  );
  
  if (isJustColor) {
    // Add sophistication to color-only names
    const productType = prefix ? prefix[1] : determineProductType(folderName);
    if (productType) {
      return `${productType} ${distinctivePart}`;
    }
  }
  
  // Handle common patterns
  if (distinctivePart.toLowerCase().includes('cuir') && distinctivePart.toLowerCase().includes('velour')) {
    return `Artisanal Duo-Texture ${distinctivePart}`;
  }
  
  return distinctivePart;
}

/**
 * Determine the product type from the folder path
 */
function determineProductType(folderPath) {
  const lowerPath = folderPath.toLowerCase();
  
  if (lowerPath.includes('derby') || lowerPath.includes('richelieu')) return 'Derby';
  if (lowerPath.includes('mocassin') || lowerPath.includes('loafer')) return 'Mocassin';
  if (lowerPath.includes('sneaker')) return 'Sneaker';
  if (lowerPath.includes('boot') || lowerPath.includes('chelsea')) return 'Boot';
  if (lowerPath.includes('chemise')) return 'Chemise';
  if (lowerPath.includes('polo')) return 'Polo';
  if (lowerPath.includes('costume')) return 'Costume';
  if (lowerPath.includes('veste') || lowerPath.includes('blazer')) return 'Veste';
  if (lowerPath.includes('pantalon')) return 'Pantalon';
  if (lowerPath.includes('ceinture')) return 'Ceinture';
  if (lowerPath.includes('cravate')) return 'Cravate';
  if (lowerPath.includes('écharpe')) return 'Écharpe';
  if (lowerPath.includes('gant')) return 'Gant';
  if (lowerPath.includes('papillion')) return 'Nœud Papillon';
  if (lowerPath.includes('babouche')) return 'Babouche';
  
  return '';
}

/**
 * Extract color information from a product name
 */
function extractColorInfo(productName) {
  const lowerName = productName.toLowerCase();
  const colors = [];
  let dominantColor = null;
  
  // Find all color mentions
  for (const [colorKey, colorInfo] of Object.entries(COLOR_MAPPINGS)) {
    if (lowerName.includes(colorKey)) {
      // Check if it's modified (e.g., "bleu clair")
      if (colorKey === 'bleu' && (lowerName.includes('bleu clair') || lowerName.includes('bleu ciel'))) {
        colors.push({ name: 'Bleu Ciel', code: '#ADD8E6' });
      } 
      else if (colorKey === 'bleu' && (lowerName.includes('bleu marine') || lowerName.includes('navy'))) {
        colors.push({ name: 'Bleu Marine', code: '#000080' });
      }
      else if (colorKey === 'marron' && (lowerName.includes('marron clair'))) {
        colors.push({ name: 'Marron Clair', code: '#A87C5F' });
      }
      else if (colorKey === 'marron' && (lowerName.includes('marron foncé'))) {
        colors.push({ name: 'Marron Foncé', code: '#5D4037' });
      }
      else {
        if (colorInfo.code) {
          colors.push({ name: colorInfo.name, code: colorInfo.code });
        }
      }
    }
  }
  
  // If no colors found but there are materials that might suggest a color
  if (colors.length === 0) {
    if (lowerName.includes('daim')) {
      colors.push({ name: 'Daim Naturel', code: '#BFB39B' });
    } else if (lowerName.includes('cuir') && !lowerName.includes('noir') && !lowerName.includes('black')) {
      colors.push({ name: 'Cuir Naturel', code: '#A87C5F' });
    }
  }
  
  // If still no colors, provide a default
  if (colors.length === 0) {
    colors.push({ name: 'Classique', code: '#4A4A4A' });
  }
  
  // Set the dominant color to the first one found
  dominantColor = colors[0];
  
  return { colors, dominantColor };
}

/**
 * Extract material information from a product name
 */
function extractMaterialInfo(productName) {
  const lowerName = productName.toLowerCase();
  const materials = [];
  
  for (const [materialKey, materialName] of Object.entries(MATERIAL_MAPPINGS)) {
    if (lowerName.includes(materialKey)) {
      materials.push(materialName);
    }
  }
  
  // If no materials found, try to infer from product type
  if (materials.length === 0) {
    if (lowerName.includes('derby') || lowerName.includes('richelieu') || lowerName.includes('mocassin')) {
      materials.push('Cuir');
    } else if (lowerName.includes('sneaker')) {
      materials.push('Cuir', 'Textile');
    } else if (lowerName.includes('polo')) {
      materials.push('Coton');
    } else if (lowerName.includes('chemise')) {
      materials.push('Coton');
    } else if (lowerName.includes('costume') || lowerName.includes('veste') || lowerName.includes('blazer')) {
      materials.push('Laine');
    } else if (lowerName.includes('ceinture')) {
      materials.push('Cuir');
    } else if (lowerName.includes('écharpe')) {
      materials.push('Cachemire');
    } else if (lowerName.includes('gant')) {
      materials.push('Cuir');
    } else if (lowerName.includes('cravate') || lowerName.includes('papillion')) {
      materials.push('Soie');
    } else if (lowerName.includes('babouche')) {
      materials.push('Cuir');
    }
  }
  
  return materials;
}

/**
 * Generate a sophisticated description for a product
 */
function generateDescription(productName, category, subcategory, materials, colors) {
  const materialString = materials.length > 0 ? 
    materials.join(' et ') : 
    'matériaux raffinés';
  
  const colorString = colors.length > 0 && colors[0].name !== 'Classique' ? 
    `en ${colors[0].name.toLowerCase()}` : 
    '';
  
  const templates = [
    `Ce ${subcategory} raffiné en ${materialString} ${colorString} incarne l'élégance intemporelle et le savoir-faire exceptionnel de la maison BRENDT.`,
    `Façonné avec un souci du détail exquis, ce ${subcategory} en ${materialString} ${colorString} représente l'alliance parfaite entre tradition artisanale et style contemporain.`,
    `Véritable pièce d'exception, ce ${subcategory} en ${materialString} ${colorString} témoigne de l'exigence et du raffinement qui caractérisent la marque BRENDT.`,
    `Conçu pour l'homme moderne épris d'élégance intemporelle, ce ${subcategory} en ${materialString} ${colorString} incarne la philosophie de la maison BRENDT: sobriété, excellence et distinction.`,
    `Un ${subcategory} d'une élégance rare en ${materialString} ${colorString}, reflétant l'héritage et le savoir-faire unique de BRENDT en matière de luxe discret.`
  ];
  
  // Select a template based on product properties for consistency
  const templateIndex = Math.abs(productName.length + category.length) % templates.length;
  let description = templates[templateIndex];
  
  // Add specific details based on category
  if (category === 'chaussures') {
    description += ` Dotée d'une semelle en cuir cousue à la main et d'une doublure en cuir souple, cette création allie confort exceptionnel et allure sophistiquée.`;
  } else if (category === 'accessoires') {
    description += ` Cet accessoire d'exception apportera une touche finale parfaite à vos tenues les plus distinguées.`;
  } else if (category === 'pret-a-porter') {
    description += ` Sa coupe impeccable et ses finitions méticuleuses en font une pièce incontournable de votre garde-robe.`;
  }
  
  return description;
}

/**
* Generate product details based on category and materials
*/
function generateProductDetails(category, subcategory, materials, colors) {
  const details = [];
  
  // General quality statement
  details.push(`Fabrication artisanale de haute qualité`);
  
  // Materials
  if (materials.length > 0) {
    const materialDetail = materials.length > 1 
      ? `Composition: ${materials.join(' et ')}` 
      : `Fait en ${materials[0]} premium`;
    details.push(materialDetail);
  }
  
  // Category-specific details
  if (category === 'chaussures') {
    details.push(`Semelle en cuir cousue à la main`);
    details.push(`Doublure en cuir souple pour un confort optimal`);
    
    if (subcategory === 'mocassins') {
      details.push(`Mocassin au tombé parfait pour un confort exceptionnel`);
    } else if (subcategory === 'derbies') {
      details.push(`Fermeture par lacets en coton ciré`);
    } else if (subcategory === 'boots') {
      details.push(`Tige renforcée pour un maintien optimal`);
    } else if (subcategory === 'sneakers') {
      details.push(`Semelle en caoutchouc naturel offrant une adhérence optimale`);
    } else if (subcategory === 'babouches') {
      details.push(`Sans talon pour un confort exceptionnel`);
      details.push(`Finition artisanale traditionnelle`);
    }
  } 
  else if (category === 'pret-a-porter') {
    if (subcategory === 'chemises') {
      details.push(`Coupe ajustée mais confortable`);
      details.push(`Boutons en nacre véritable`);
    } else if (subcategory === 'polos') {
      details.push(`Maille fine et légère pour un confort optimal`);
      details.push(`Col et poignets côtelés`);
    } else if (subcategory === 'costumes' || subcategory === 'vestes') {
      details.push(`Doublure en soie et cupro`);
      details.push(`Coupe semi-ajustée contemporaine`);
    } else if (subcategory === 'pantalons') {
      details.push(`Fermeture à bouton et zip`);
      details.push(`Poches italiennes sur le devant`);
    }
  }
  else if (category === 'accessoires') {
    details.push(`Finitions méticuleuses réalisées à la main`);
    
    if (subcategory === 'ceintures') {
      details.push(`Boucle en métal finition palladium`);
    } else if (subcategory === 'cravates' || subcategory === 'noeuds-papillon') {
      details.push(`Entièrement doublée pour un tombé parfait`);
    } else if (subcategory === 'echarpes') {
      details.push(`Tissage fin et élégant`);
    }
  }
  
  // Origin
  details.push(`Fabriqué en Europe par nos artisans d'exception`);
  
  return details;
 }
 
 /**
 * Generate care instructions based on materials and category
 */
 function generateCareInstructions(category, materials) {
  let care = '';
  
  if (category === 'chaussures') {
    if (materials.includes('Cuir')) {
      care = `Nettoyez avec un chiffon doux et sec. Appliquez régulièrement un cirage de qualité adapté à la couleur du cuir. Utilisez des embauchoirs en cèdre entre chaque port pour préserver la forme.`;
    } else if (materials.includes('Daim')) {
      care = `Brossez délicatement avec une brosse spéciale daim pour éliminer les poussières. Protégez avec un spray imperméabilisant avant la première utilisation. Évitez tout contact avec l'eau.`;
    } else {
      care = `Nettoyez avec un chiffon légèrement humide. Laissez sécher naturellement loin de toute source de chaleur. Utilisez des embauchoirs entre chaque port.`;
    }
  } 
  else if (category === 'pret-a-porter') {
    if (materials.includes('Cachemire') || materials.includes('Laine')) {
      care = `Nettoyage à sec recommandé. Pour un entretien régulier, aérez après chaque port et pliez soigneusement pour le rangement. En cas de nécessité, lavage à la main à l'eau froide avec un savon doux spécial laine.`;
    } else if (materials.includes('Soie')) {
      care = `Nettoyage à sec uniquement. Rangez sur un cintre de qualité dans un endroit sec à l'abri de la lumière.`;
    } else if (materials.includes('Coton') || materials.includes('Lin')) {
      care = `Lavage délicat à 30°C. Repassage sur l'envers à température modérée. Séchage à plat pour préserver la forme.`;
    } else {
      care = `Suivez les instructions spécifiques sur l'étiquette. Pour prolonger la durée de vie du vêtement, privilégiez le nettoyage à sec professionnel.`;
    }
  }
  else if (category === 'accessoires') {
    if (materials.includes('Cuir') || materials.includes('Daim')) {
      care = `Conservez dans la pochette fournie lorsque vous ne l'utilisez pas. Évitez l'exposition à l'eau, à la chaleur et au soleil direct. Nettoyez avec un chiffon doux et sec.`;
    } else if (materials.includes('Soie')) {
      care = `Nettoyage à sec uniquement par un professionnel. Conservez roulé dans un endroit sec à l'abri de la lumière.`;
    } else if (materials.includes('Cachemire') || materials.includes('Laine')) {
      care = `Nettoyage à sec recommandé. Pour un entretien léger, aérez régulièrement et conservez à plat dans un tiroir.`;
    } else {
      care = `Conservez dans son emballage d'origine. Évitez l'humidité et l'exposition prolongée à la lumière directe.`;
    }
  }
  
  return care;
 }
 
 /**
 * Generate appropriate sizes based on category and subcategory
 * @param {string} category - Product category
 * @param {string} subcategory - Product subcategory
 * @param {string} gender - Product gender ('homme' or 'femme')
 */
 function generateSizes(category, subcategory, gender) {
  if (category === 'chaussures') {
    // Different size ranges for homme and femme
    if (gender === 'femme') {
      return [
        { name: "35", eu: "35", uk: "2", us: "4", available: Math.random() > 0.2 },
        { name: "36", eu: "36", uk: "3", us: "5", available: Math.random() > 0.1 },
        { name: "37", eu: "37", uk: "4", us: "6", available: Math.random() > 0.1 },
        { name: "38", eu: "38", uk: "5", us: "7", available: true },
        { name: "39", eu: "39", uk: "6", us: "8", available: true },
        { name: "40", eu: "40", uk: "7", us: "9", available: Math.random() > 0.1 },
        { name: "41", eu: "41", uk: "8", us: "10", available: Math.random() > 0.3 }
      ];
    } else { // homme
      return [
        { name: "39", eu: "39", uk: "5", us: "6", available: Math.random() > 0.2 },
        { name: "40", eu: "40", uk: "6", us: "7", available: Math.random() > 0.1 },
        { name: "41", eu: "41", uk: "7", us: "8", available: Math.random() > 0.1 },
        { name: "42", eu: "42", uk: "8", us: "9", available: true },
        { name: "43", eu: "43", uk: "9", us: "10", available: true },
        { name: "44", eu: "44", uk: "10", us: "11", available: Math.random() > 0.1 },
        { name: "45", eu: "45", uk: "11", us: "12", available: Math.random() > 0.3 },
        { name: "46", eu: "46", uk: "12", us: "13", available: Math.random() > 0.5 }
      ];
    }
  } 
  else if (category === 'pret-a-porter') {
    if (gender === 'femme') {
      if (subcategory === 'chemises' || subcategory === 'polos' || subcategory === 'vestes') {
        return [
          { name: "XS", available: Math.random() > 0.2 },
          { name: "S", available: true },
          { name: "M", available: true },
          { name: "L", available: Math.random() > 0.1 },
          { name: "XL", available: Math.random() > 0.4 }
        ];
      } else if (subcategory === 'pantalons') {
        return [
          { name: "34", waist: "66-69", available: Math.random() > 0.3 },
          { name: "36", waist: "70-73", available: Math.random() > 0.2 },
          { name: "38", waist: "74-77", available: true },
          { name: "40", waist: "78-81", available: true },
          { name: "42", waist: "82-85", available: true },
          { name: "44", waist: "86-89", available: Math.random() > 0.3 }
        ];
      }
    } else { // homme
      if (subcategory === 'chemises' || subcategory === 'polos' || subcategory === 'vestes') {
        return [
          { name: "XS", available: Math.random() > 0.3 },
          { name: "S", available: true },
          { name: "M", available: true },
          { name: "L", available: true },
          { name: "XL", available: Math.random() > 0.1 },
          { name: "XXL", available: Math.random() > 0.4 }
        ];
      } else if (subcategory === 'pantalons') {
        return [
          { name: "44", waist: "76-79", available: Math.random() > 0.3 },
          { name: "46", waist: "80-83", available: Math.random() > 0.2 },
          { name: "48", waist: "84-87", available: true },
          { name: "50", waist: "88-91", available: true },
          { name: "52", waist: "92-95", available: true },
          { name: "54", waist: "96-99", available: Math.random() > 0.3 },
          { name: "56", waist: "100-103", available: Math.random() > 0.5 }
        ];
      } else if (subcategory === 'costumes') {
        return [
          { name: "46", chest: "91-94", available: Math.random() > 0.3 },
          { name: "48", chest: "95-98", available: Math.random() > 0.2 },
          { name: "50", chest: "99-102", available: true },
          { name: "52", chest: "103-106", available: true },
          { name: "54", chest: "107-110", available: Math.random() > 0.2 },
          { name: "56", chest: "111-114", available: Math.random() > 0.4 }
        ];
      }
    }
  }
  else if (category === 'accessoires') {
    if (subcategory === 'ceintures') {
      if (gender === 'femme') {
        return [
          { name: "75", waist: "65-70", available: Math.random() > 0.2 },
          { name: "80", waist: "70-75", available: true },
          { name: "85", waist: "75-80", available: true },
          { name: "90", waist: "80-85", available: Math.random() > 0.3 },
          { name: "95", waist: "85-90", available: Math.random() > 0.5 }
        ];
      } else { // homme
        return [
          { name: "85", waist: "75-80", available: Math.random() > 0.2 },
          { name: "90", waist: "80-85", available: true },
          { name: "95", waist: "85-90", available: true },
          { name: "100", waist: "90-95", available: true },
          { name: "105", waist: "95-100", available: Math.random() > 0.3 },
          { name: "110", waist: "100-105", available: Math.random() > 0.5 }
        ];
      }
    } else if (subcategory === 'gants') {
      if (gender === 'femme') {
        return [
          { name: "6.5", handWidth: "16-17", available: Math.random() > 0.2 },
          { name: "7", handWidth: "17-18", available: true },
          { name: "7.5", handWidth: "18-19", available: true },
          { name: "8", handWidth: "19-20", available: Math.random() > 0.3 }
        ];
      } else { // homme
        return [
          { name: "7.5", handWidth: "19-20", available: Math.random() > 0.2 },
          { name: "8", handWidth: "20-21", available: true },
          { name: "8.5", handWidth: "21-22", available: true },
          { name: "9", handWidth: "22-23", available: true },
          { name: "9.5", handWidth: "23-24", available: Math.random() > 0.3 }
        ];
      }
    } else {
      return [
        { name: "Taille Unique", available: true }
      ];
    }
  }
  
  // Default size
  return [
    { name: "Taille Unique", available: true }
  ];
 }
 
 /**
 * Generate a price appropriate for the category and materials
 */
 function generatePrice(category, subcategory, materials) {
  let basePrice = 0;
  
  // Set base price by category
  if (category === 'chaussures') {
    if (subcategory === 'mocassins' || subcategory === 'derbies') basePrice = 650;
    else if (subcategory === 'boots') basePrice = 750;
    else if (subcategory === 'sneakers') basePrice = 550;
    else if (subcategory === 'babouches') basePrice = 450;
  } 
  else if (category === 'pret-a-porter') {
    if (subcategory === 'chemises') basePrice = 250;
    else if (subcategory === 'polos') basePrice = 190;
    else if (subcategory === 'vestes') basePrice = 850;
    else if (subcategory === 'costumes') basePrice = 1200;
    else if (subcategory === 'pantalons') basePrice = 320;
  }
  else if (category === 'accessoires') {
    if (subcategory === 'ceintures') basePrice = 280;
    else if (subcategory === 'cravates' || subcategory === 'noeuds-papillon') basePrice = 150;
    else if (subcategory === 'echarpes') basePrice = 320;
    else if (subcategory === 'gants') basePrice = 240;
    else if (subcategory === 'casquettes') basePrice = 180;
    else if (subcategory === 'petite-maroquinerie') basePrice = 260;
    else basePrice = 200;
  }
  else {
    basePrice = 350; // Default for other categories
  }
  
  // Adjust price based on materials
  if (materials.includes('Cachemire')) basePrice *= 1.5;
  else if (materials.includes('Cuir')) basePrice *= 1.2;
  else if (materials.includes('Soie')) basePrice *= 1.3;
  else if (materials.includes('Lin')) basePrice *= 1.1;
  
  // Add slight randomization for uniqueness
  const randomFactor = 0.95 + (Math.random() * 0.2); // Between 0.95 and 1.15
  basePrice = Math.round(basePrice * randomFactor / 10) * 10; // Round to nearest 10
  
  return basePrice;
 }
 
 // Run the main function
 main();
 
 // Export the scanning functions for external use
 module.exports = { 
  scanHommeProducts,
  scanFemmeProducts,
  scanProductsByGender
 }