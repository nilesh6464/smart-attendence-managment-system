const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Solutions:');
    console.error('1. Check if MongoDB is running locally');
    console.error('2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.error('3. Update MONGO_URI in backend/.env file');
    console.error('4. See MONGODB_SETUP.md for detailed instructions\n');
    process.exit(1);
  }
};

module.exports = connectDB;
