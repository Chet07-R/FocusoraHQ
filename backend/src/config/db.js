const mongoose = require('mongoose');
const { env } = require('./env');

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it in backend/.env');
  }

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
  } catch (error) {
    throw new Error(
      `MongoDB connection failed: ${error.message}. ` +
      'If you use MongoDB Atlas, verify internet access/DNS; otherwise switch MONGODB_URI to a reachable local MongoDB instance.'
    );
  }
};

module.exports = { connectDB };
