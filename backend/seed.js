require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Adjust path to your User model
const Review = require('./src/models/Review');
const Blog = require('./src/models/Blog');

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
      },
      {
        displayName: 'Diana Productivity',
        email: 'diana@focusora.local',
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
    // await User.deleteMany({});
    // await Review.deleteMany({});
    
    let insertedUsers = [];
    try {
      insertedUsers = await User.insertMany(dummyUsers);
      console.log('✅ Successfully seeded dummy users into the database!');
    } catch (e) {
       console.log('Dummy users may already exist, fetching them...');
       const emails = dummyUsers.map(u => u.email);
       insertedUsers = await User.find({ email: { $in: emails } });
    }

    // 5. Add dummy reviews from these accounts
    const dummyReviews = [
      {
        authorId: insertedUsers[0]?._id,
        name: insertedUsers[0]?.displayName || 'Alice Scholar',
        role: 'Computer Science Student',
        message: 'FocusoraHQ completely transformed my study routine. The pomodoro timer mixed with the study rooms is a game changer!',
        rating: 5,
      },
      {
        authorId: insertedUsers[1]?._id,
        name: insertedUsers[1]?.displayName || 'Bob Focus',
        role: 'MBA Candidate',
        message: 'The productivity tracking features let me see exactly how much deep work I am getting done. Highly recommended.',
        rating: 4,
      },
      {
        authorId: insertedUsers[2]?._id,
        name: insertedUsers[2]?.displayName || 'Charlie Learner',
        role: 'High School Senior',
        message: 'I love competing on the leaderboard with my friends. It makes studying for exams actually fun!',
        rating: 5,
      }
    ];

    try {
      await Review.insertMany(dummyReviews);
      console.log('✅ Successfully seeded dummy reviews into the database!');
    } catch (e) {
      console.error('❌ Error seeding reviews:', e);
    }

    // 6. Add dummy blogs from these accounts
    const dummyBlogs = [
      {
        authorId: insertedUsers[0]?._id,
        authorName: insertedUsers[0]?.displayName || 'Alice Scholar',
        authorEmail: insertedUsers[0]?.email || 'alice@focusora.local',
        title: 'Mastering the Pomodoro Technique in 2026',
        category: 'Productivity',
        excerpt: 'Learn how to maximize your study sessions using the classic Pomodoro method combined with modern tools.',
        content: '## The Power of 25 Minutes\n\nThe Pomodoro Technique is more relevant than ever. By dedicating 25 minutes of pure, uninterrupted focus, followed by a 5-minute break, you train your brain to handle intensive workloads without burning out. At FocusoraHQ, the integrated timer makes this incredibly seamless.\n\nHere are a few tips to get the most out of your sessions:\n\n- Turn off notifications on all your devices.\n- Have your water and snacks ready beforehand.\n- Commit to the specific task—no multitasking!\n\nOnce you hit 4 Pomodoros, take a longer break. You will be amazed at how much you can accomplish.',
        coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        readTime: '3 min read',
        isCommunity: true,
        status: 'published'
      },
      {
        authorId: insertedUsers[1]?._id,
        authorName: insertedUsers[1]?.displayName || 'Bob Focus',
        authorEmail: insertedUsers[1]?.email || 'bob@focusora.local',
        title: 'How Virtual Study Rooms Keep Me Accountable',
        category: 'Focus',
        excerpt: 'Body doubling is a powerful psychological tool. Here is why studying with others online works.',
        content: '## What is Body Doubling?\n\nWorking alongside someone else, even virtually, can significantly boost your concentration. This is known as "body doubling." It creates a sense of accountability—you see someone else grinding through their work, and it motivates you to do the same.\n\n## My Experience\n\nBefore using FocusoraHQ study rooms, I would easily get distracted by social media. Now, I join a room, see my peers studying hard, and instantly slip into the zone. The built-in ambient sounds (like coffee shop noise) add the perfect background layer to drown out my actual noisy environment.',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        readTime: '4 min read',
        isCommunity: true,
        status: 'published'
      },
      {
        authorId: insertedUsers[2]?._id,
        authorName: insertedUsers[2]?.displayName || 'Charlie Learner',
        authorEmail: insertedUsers[2]?.email || 'charlie@focusora.local',
        title: 'Building a Tech Setup for Deep Work',
        category: 'Lifestyle',
        excerpt: 'Your environment dictates your focus. Discover the essential tools for a distraction-free desk setup.',
        content: '## Ergonomics First\n\nYou cannot focus if your back hurts. Start with a solid ergonomic chair and ensure your monitor is at eye level. This minor change can add hours to your endurance.\n\n## The Software Stack\n\nHardware is only half the battle. Your digital environment matters just as much. I use FocusoraHQ to manage my daily tasks, block distracting websites, and log my study hours locally.\n\nBy having a defined digital workspace, my brain knows that when I open this specific app, it is time to work. Combine this with noise-canceling headphones, and you are unstoppable.',
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        readTime: '5 min read',
        isCommunity: true,
        status: 'published'
      },
      {
        authorId: insertedUsers[3]?._id,
        authorName: insertedUsers[3]?.displayName || 'Diana Productivity',
        authorEmail: insertedUsers[3]?.email || 'diana@focusora.local',
        title: 'Optimizing Your Sleep for Better Studying',
        category: 'Wellness',
        excerpt: 'Why pulling an all-nighter is the worst thing you can do for your grades and focus.',
        content: '## The Myth of the All-Nighter\n\nWe have all been there—cramming for an exam at 3 AM. But research shows that sleep deprivation heavily impairs your cognitive function.\n\nInstead of staying up, try studying effectively in focused bursts during the day using FocusoraHQ. Aim for 7-9 hours of sleep, and let your brain consolidate the information you learned.',
        coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        readTime: '3 min read',
        isCommunity: true,
        status: 'published'
      }
    ];

    try {
      await Blog.insertMany(dummyBlogs);
      console.log('✅ Successfully seeded dummy blogs into the database!');
    } catch (e) {
      console.error('❌ Error seeding blogs:', e);
    }

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