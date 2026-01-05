const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('🔗 Host:', conn.connection.host);
    console.log('📁 Database Name:', conn.connection.name); // THIS IS THE KEY!
    console.log('📊 Collections:', Object.keys(conn.connection.collections));
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
