const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = 'mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt';

async function addAgafayCroco() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get original Agafay Walk to copy structure
    const originalAgafay = await Product.findById('684de02754a158e11ff1cac3');
    if (!originalAgafay) {
      console.error('Original Agafay Walk not found');
      return;
    }

    // Create new product for Vert Croco
    const agafayCroco = new Product({
      name: 'Agafay Walk Croco',
      price: 890,
      category: originalAgafay.category,
      categoryName: originalAgafay.categoryName,
      subcategory: originalAgafay.subcategory,
      subcategoryName: originalAgafay.subcategoryName,
      description: originalAgafay.description,
      details: originalAgafay.details,
      care: originalAgafay.care,
      colors: [{
        name: 'Vert Croco',
        code: '#228B22',
        images: [
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/1.jpeg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/2.jpeg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/3.jpeg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/4.jpeg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/5.jpeg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Agafay-Walk/Vert-Croco/6.jpeg'
        ],
        inStock: true
      }],
      materials: originalAgafay.materials,
      sizes: originalAgafay.sizes.map(size => ({
        ...size.toObject(),
        available: size.name === '46' ? false : true
      })),
      rating: originalAgafay.rating,
      reviewCount: 0,
      inStock: true,
      isNewArrival: true,
      isBestseller: false,
      gender: originalAgafay.gender
    });

    await agafayCroco.save();
    console.log('✅ Created Agafay Walk Croco product with ID:', agafayCroco._id);

    // Now remove Vert Croco from original Agafay Walk
    const vertCrocoIndex = originalAgafay.colors.findIndex(c => c.name === 'Vert Croco');
    if (vertCrocoIndex !== -1) {
      originalAgafay.colors.splice(vertCrocoIndex, 1);
      await originalAgafay.save();
      console.log('✅ Removed Vert Croco from original Agafay Walk');
    }

    console.log('All done! Agafay Walk Croco is now a separate product at 890 MAD');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addAgafayCroco();
