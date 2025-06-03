// server/update-stock.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt';
console.log('Using MongoDB URI:', MONGODB_URI);

/**
 * Updates product size availability
 * @param {string} productId - MongoDB ID of the product
 * @param {string} sizeName - Name of the size to update
 * @param {boolean} available - Whether the size is available
 */
async function updateSizeAvailability(productId, sizeName, available) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    const sizeIndex = product.sizes.findIndex(size => size.name === sizeName);
    if (sizeIndex === -1) {
      console.log(`Size ${sizeName} not found for product ${product.name}`);
      return false;
    }

    // Update the size availability
    product.sizes[sizeIndex].available = available;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, Size: ${sizeName}, Available: ${available}`);
    return true;
  } catch (error) {
    console.error('Error updating size availability:', error);
    return false;
  }
}

/**
 * Sets overall product availability
 * @param {string} productId - MongoDB ID of the product
 * @param {boolean} inStock - Whether the product is in stock
 */
async function updateProductStock(productId, inStock) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    // Update the product stock status
    product.inStock = inStock;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, In Stock: ${inStock}`);
    return true;
  } catch (error) {
    console.error('Error updating product stock:', error);
    return false;
  }
}

/**
 * Updates product price
 * @param {string} productId - MongoDB ID of the product
 * @param {number} newPrice - New price for the product
 */
async function updateProductPrice(productId, newPrice) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    product.price = newPrice;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, New price: ${newPrice} MAD`);
    return true;
  } catch (error) {
    console.error('Error updating product price:', error);
    return false;
  }
}

/**
 * Updates color variant price
 * @param {string} productId - MongoDB ID of the product
 * @param {string} colorName - Name of the color variant
 * @param {number} newPrice - New price for the color variant
 */
async function updateColorVariantPrice(productId, colorName, newPrice) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    const colorIndex = product.colors.findIndex(color => color.name === colorName);
    if (colorIndex === -1) {
      console.log(`Color ${colorName} not found for product ${product.name}`);
      return false;
    }

    // Update the color variant price
    product.colors[colorIndex].price = newPrice;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, Color: ${colorName}, New price: ${newPrice} MAD`);
    return true;
  } catch (error) {
    console.error('Error updating color variant price:', error);
    return false;
  }
}

/**
 * Updates color variant price by index
 * @param {string} productId - MongoDB ID of the product
 * @param {number} colorIndex - Index of the color variant
 * @param {number} newPrice - New price for the color variant
 */
async function updateColorVariantPriceByIndex(productId, colorIndex, newPrice) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    if (colorIndex >= product.colors.length || colorIndex < 0) {
      console.log(`Color index ${colorIndex} out of range. Product has ${product.colors.length} colors.`);
      return false;
    }

    const color = product.colors[colorIndex];
    product.colors[colorIndex].price = newPrice;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, Color[${colorIndex}]: ${color.name}, New price: ${newPrice} MAD`);
    return true;
  } catch (error) {
    console.error('Error updating color variant price by index:', error);
    return false;
  }
}

/**
 * Updates color variant stock by name
 * @param {string} productId - MongoDB ID of the product
 * @param {string} colorName - Name of the color variant
 * @param {boolean} inStock - Whether the color is in stock
 */
async function updateColorVariantStock(productId, colorName, inStock) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    const colorIndex = product.colors.findIndex(color => color.name === colorName);
    if (colorIndex === -1) {
      console.log(`Color ${colorName} not found for product ${product.name}`);
      return false;
    }

    // Update the color variant stock
    product.colors[colorIndex].inStock = inStock;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, Color: ${colorName}, In Stock: ${inStock}`);
    return true;
  } catch (error) {
    console.error('Error updating color variant stock:', error);
    return false;
  }
}

/**
 * Updates color variant stock by index
 * @param {string} productId - MongoDB ID of the product
 * @param {number} colorIndex - Index of the color variant
 * @param {boolean} inStock - Whether the color is in stock
 */
async function updateColorVariantStockByIndex(productId, colorIndex, inStock) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    if (colorIndex >= product.colors.length || colorIndex < 0) {
      console.log(`Color index ${colorIndex} out of range. Product has ${product.colors.length} colors.`);
      return false;
    }

    const color = product.colors[colorIndex];
    product.colors[colorIndex].inStock = inStock;
    await product.save();
    console.log(`✅ Updated product: ${product.name}, Color[${colorIndex}]: ${color.name}, In Stock: ${inStock}`);
    return true;
  } catch (error) {
    console.error('Error updating color variant stock by index:', error);
    return false;
  }
}

/**
 * Removes color variant price (falls back to main product price)
 * @param {string} productId - MongoDB ID of the product
 * @param {string} colorName - Name of the color variant
 */
async function removeColorVariantPrice(productId, colorName) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    const colorIndex = product.colors.findIndex(color => color.name === colorName);
    if (colorIndex === -1) {
      console.log(`Color ${colorName} not found for product ${product.name}`);
      return false;
    }

    // Remove the color variant price (unset the field)
    if (product.colors[colorIndex].price !== undefined) {
      product.colors[colorIndex].price = undefined;
      await product.save();
      console.log(`✅ Removed custom price for product: ${product.name}, Color: ${colorName} (will use main product price)`);
    } else {
      console.log(`Color ${colorName} already uses main product price`);
    }
    return true;
  } catch (error) {
    console.error('Error removing color variant price:', error);
    return false;
  }
}

/**
 * Removes color variant price by index
 * @param {string} productId - MongoDB ID of the product
 * @param {number} colorIndex - Index of the color variant
 */
async function removeColorVariantPriceByIndex(productId, colorIndex) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return false;
    }

    if (colorIndex >= product.colors.length || colorIndex < 0) {
      console.log(`Color index ${colorIndex} out of range. Product has ${product.colors.length} colors.`);
      return false;
    }

    const color = product.colors[colorIndex];
    
    // Remove the color variant price (unset the field)
    if (product.colors[colorIndex].price !== undefined) {
      product.colors[colorIndex].price = undefined;
      await product.save();
      console.log(`✅ Removed custom price for product: ${product.name}, Color[${colorIndex}]: ${color.name} (will use main product price)`);
    } else {
      console.log(`Color[${colorIndex}]: ${color.name} already uses main product price`);
    }
    return true;
  } catch (error) {
    console.error('Error removing color variant price by index:', error);
    return false;
  }
}

/**
 * Lists all products with their sizes and availability
 */
async function listProducts() {
  try {
    const products = await Product.find().select('_id name category subcategory sizes inStock price colors');
    
    console.log('\n===== PRODUCT INVENTORY =====\n');
    products.forEach(product => {
      console.log(`ID: ${product._id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Category: ${product.category} / ${product.subcategory}`);
      console.log(`Main Price: ${product.price} MAD`);
      console.log(`Overall Stock: ${product.inStock ? 'In Stock' : 'Out of Stock'}`);
      
      console.log('Colors:');
      product.colors.forEach((color, index) => {
        const stockStatus = color.inStock !== false ? 'In Stock' : 'Out of Stock';
        if (color.price) {
          console.log(`  [${index}] - ${color.name}: Custom price ${color.price} MAD (${stockStatus})`);
        } else {
          console.log(`  [${index}] - ${color.name}: Uses main price (${product.price} MAD) (${stockStatus})`);
        }
      });
      
      console.log('Sizes:');
      product.sizes.forEach(size => {
        console.log(`  - ${size.name}: ${size.available ? 'Available' : 'Unavailable'}`);
      });
      
      console.log('\n-------------------\n');
    });
    
    return true;
  } catch (error) {
    console.error('Error listing products:', error);
    return false;
  }
}

/**
 * Main function that handles command line arguments
 */
async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    const args = process.argv.slice(2);
    const command = args[0];

    if (command === 'list') {
      // List all products
      await listProducts();
    } 
    else if (command === 'update-size') {
      // Update size availability: node update-stock.js update-size [productId] [sizeName] [true/false]
      if (args.length !== 4) {
        console.log('Usage: node update-stock.js update-size [productId] [sizeName] [true/false]');
        return;
      }
      
      const productId = args[1];
      const sizeName = args[2];
      const available = args[3].toLowerCase() === 'true';
      
      await updateSizeAvailability(productId, sizeName, available);
    } 
    else if (command === 'update-product') {
      // Update product stock: node update-stock.js update-product [productId] [true/false]
      if (args.length !== 3) {
        console.log('Usage: node update-stock.js update-product [productId] [true/false]');
        return;
      }
      
      const productId = args[1];
      const inStock = args[2].toLowerCase() === 'true';
      
      await updateProductStock(productId, inStock);
    } 
    else if (command === 'update-price') {
      // Update product price: node update-stock.js update-price [productId] [newPrice]
      if (args.length !== 3) {
        console.log('Usage: node update-stock.js update-price [productId] [newPrice]');
        return;
      }
      
      const productId = args[1];
      const newPrice = parseFloat(args[2]);
      
      if (isNaN(newPrice) || newPrice < 0) {
        console.log('Error: Please provide a valid price (positive number)');
        return;
      }
      
      await updateProductPrice(productId, newPrice);
    } 
    else if (command === 'update-color-price') {
      // Update color variant price: node update-stock.js update-color-price [productId] [colorName] [newPrice]
      if (args.length !== 4) {
        console.log('Usage: node update-stock.js update-color-price [productId] [colorName] [newPrice]');
        return;
      }
      
      const productId = args[1];
      const colorName = args[2];
      const newPrice = parseFloat(args[3]);
      
      if (isNaN(newPrice) || newPrice < 0) {
        console.log('Error: Please provide a valid price (positive number)');
        return;
      }
      
      await updateColorVariantPrice(productId, colorName, newPrice);
    } 
    else if (command === 'update-color-price-index') {
      // Update color variant price by index: node update-stock.js update-color-price-index [productId] [colorIndex] [newPrice]
      if (args.length !== 4) {
        console.log('Usage: node update-stock.js update-color-price-index [productId] [colorIndex] [newPrice]');
        return;
      }
      
      const productId = args[1];
      const colorIndex = parseInt(args[2]);
      const newPrice = parseFloat(args[3]);
      
      if (isNaN(colorIndex) || colorIndex < 0) {
        console.log('Error: Please provide a valid color index (0, 1, 2, ...)');
        return;
      }
      
      if (isNaN(newPrice) || newPrice < 0) {
        console.log('Error: Please provide a valid price (positive number)');
        return;
      }
      
      await updateColorVariantPriceByIndex(productId, colorIndex, newPrice);
    } 
    else if (command === 'update-color-stock') {
      // Update color variant stock: node update-stock.js update-color-stock [productId] [colorName] [true/false]
      if (args.length !== 4) {
        console.log('Usage: node update-stock.js update-color-stock [productId] [colorName] [true/false]');
        return;
      }
      
      const productId = args[1];
      const colorName = args[2];
      const inStock = args[3].toLowerCase() === 'true';
      
      await updateColorVariantStock(productId, colorName, inStock);
    } 
    else if (command === 'update-color-stock-index') {
      // Update color variant stock by index: node update-stock.js update-color-stock-index [productId] [colorIndex] [true/false]
      if (args.length !== 4) {
        console.log('Usage: node update-stock.js update-color-stock-index [productId] [colorIndex] [true/false]');
        return;
      }
      
      const productId = args[1];
      const colorIndex = parseInt(args[2]);
      const inStock = args[3].toLowerCase() === 'true';
      
      if (isNaN(colorIndex) || colorIndex < 0) {
        console.log('Error: Please provide a valid color index (0, 1, 2, ...)');
        return;
      }
      
      await updateColorVariantStockByIndex(productId, colorIndex, inStock);
    } 
    else if (command === 'remove-color-price') {
      // Remove color variant price: node update-stock.js remove-color-price [productId] [colorName]
      if (args.length !== 3) {
        console.log('Usage: node update-stock.js remove-color-price [productId] [colorName]');
        return;
      }
      
      const productId = args[1];
      const colorName = args[2];
      
      await removeColorVariantPrice(productId, colorName);
    } 
    else if (command === 'remove-color-price-index') {
      // Remove color variant price by index: node update-stock.js remove-color-price-index [productId] [colorIndex]
      if (args.length !== 3) {
        console.log('Usage: node update-stock.js remove-color-price-index [productId] [colorIndex]');
        return;
      }
      
      const productId = args[1];
      const colorIndex = parseInt(args[2]);
      
      if (isNaN(colorIndex) || colorIndex < 0) {
        console.log('Error: Please provide a valid color index (0, 1, 2, ...)');
        return;
      }
      
      await removeColorVariantPriceByIndex(productId, colorIndex);
    } 
    else {
      console.log('Unknown command. Available commands:');
      console.log('- list: List all products and their availability');
      console.log('- update-size [productId] [sizeName] [true/false]: Update size availability');
      console.log('- update-product [productId] [true/false]: Update product stock status');
      console.log('- update-price [productId] [newPrice]: Update main product price');
      console.log('- update-color-price [productId] [colorName] [newPrice]: Update color variant price');
      console.log('- update-color-price-index [productId] [colorIndex] [newPrice]: Update color variant price by index');
      console.log('- update-color-stock [productId] [colorName] [true/false]: Update color variant stock');
      console.log('- update-color-stock-index [productId] [colorIndex] [true/false]: Update color variant stock by index');
      console.log('- remove-color-price [productId] [colorName]: Remove color variant price (use main price)');
      console.log('- remove-color-price-index [productId] [colorIndex]: Remove color variant price by index');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main();