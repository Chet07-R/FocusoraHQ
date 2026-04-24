const app = require('../src/app');
const { connectDB } = require('../src/config/db');

let dbConnectionPromise = null;

const ensureDbConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  return dbConnectionPromise;
};

module.exports = async (req, res) => {
  await ensureDbConnection();
  return app(req, res);
};