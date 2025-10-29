const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI se link uthayega
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB Atlas se connect ho gaya...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
