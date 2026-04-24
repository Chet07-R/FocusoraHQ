const mongoose = require('mongoose');
const { env } = require('./env');

let connectionPromise = null;

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it in backend/.env');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
    })
    .catch((error) => {
      connectionPromise = null;
      throw new Error(
        `MongoDB connection failed: ${error.message}. ` +
        'If you use MongoDB Atlas, verify internet access/DNS; otherwise switch MONGODB_URI to a reachable local MongoDB instance.'
      );
    });

  return connectionPromise;
};

module.exports = { connectDB };
