const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy';
    const conn = await mongoose.connect(mongoURI);
    console.log('MongoDB Connected to:', conn.connection.host);
    console.log('Database name:', conn.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
