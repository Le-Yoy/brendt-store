const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = 'mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt';

async function updateProductColors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Tarhazout
    const tarhazout = await Product.findById('684de02754a158e11ff1cad5');
    if (tarhazout) {
      // Find and rename Raffia to Marron & Beige
      const raffiaIndex = tarhazout.colors.findIndex(c => c.name === 'Raffia');
      if (raffiaIndex !== -1) {
        tarhazout.colors[raffiaIndex].name = 'Marron & Beige';
        tarhazout.colors[raffiaIndex].images = [
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Marron-&-Beige/1.webp',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Marron-&-Beige/2.webp',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Marron-&-Beige/3.jpg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Marron-&-Beige/4.jpg'
        ];
      }
      
      // Add Bleu & Beige
      tarhazout.colors.push({
        name: 'Bleu & Beige',
        code: '#4682B4',
        images: [
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Bleu-&-Beige/1.jpg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Bleu-&-Beige/2.jpg',
          '/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Raffia-Bleu-&-Beige/3.jpg'
        ],
        inStock: true
      });
      
      await tarhazout.save();
      console.log('✅ Updated Tarhazout colors');
    }

    // Update Agafay Walk
    const agafay = await Product.findById('684de02754a158e11ff1cac3');
    if (agafay) {
      // Find and rename Rouge to Beige
      const rougeIndex = agafay.colors.findIndex(c => c.name === 'Rouge');
      if (rougeIndex !== -1) {
        agafay.colors[rougeIndex].name = 'Beige';
        agafay.colors[rougeIndex].code = '#F5DEB3';
      }
      
      // Add Vert Croco
      agafay.colors.push({
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
        price: 890,
        inStock: true
      });
      
      await agafay.save();
      console.log('✅ Updated Agafay Walk colors');
    }

    console.log('All updates completed successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

updateProductColors();
