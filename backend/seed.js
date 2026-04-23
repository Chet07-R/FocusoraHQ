require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Adjust path to your User model

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // 2. Hash a common password for all test accounts
    const commonPasswordHash = await bcrypt.hash('password123', 10);

    // 3. Define the dummy users
    const dummyUsers = [
      {
        displayName: 'Alice Scholar',
        email: 'alice@focusora.local',
        passwordHash: commonPasswordHash,
        points: 0,
        totalStudyMinutes: 0,
        sessionsCount: 0,
        isEmailVerified: true,
        provider: 'local',
      },
      {
        displayName: 'Bob Focus',
        email: 'bob@focusora.local',
        passwordHash: commonPasswordHash,
        points: 0,
        totalStudyMinutes: 0,
        sessionsCount: 0,
        isEmailVerified: true,
        provider: 'local',
      },
      {
        displayName: 'Charlie Learner',
        email: 'charlie@focusora.local',
        passwordHash: commonPasswordHash,
        points: 0,
        totalStudyMinutes: 0,
        sessionsCount: 0,
        isEmailVerified: true,
        provider: 'local',
      }
    ];

    // 4. Insert users into the database
    // (Optional: You could add `await User.deleteMany({});` here if you wanted to wipe the DB first)
    await User.insertMany(dummyUsers);
    console.log('✅ Successfully seeded dummy users into the database!');

  } catch (error) {
    // If a user already exists (duplicate email), it will throw an error
    if (error.code === 11000) {
      console.error('❌ Error: One or more dummy users already exist in the database.');
    } else {
      console.error('❌ Error seeding database:', error);
    }
  } finally {
    // 5. Disconnect from the database so the script finishes
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedDatabase();