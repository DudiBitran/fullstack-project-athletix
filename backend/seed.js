require('dotenv').config();
const mongoose = require('mongoose');
const { populateDatabase } = require('./initialData');

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_ATLAS_URI || 'mongodb://localhost:27017/athletix';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    console.log('\nStarting database seeding...');
    await populateDatabase();
    
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 