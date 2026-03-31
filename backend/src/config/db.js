const mongoose = require('mongoose');
const { env } = require('./env');

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it in backend/.env');
  }

  await mongoose.connect(env.mongoUri);
};

module.exports = { connectDB };
