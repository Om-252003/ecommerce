require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function verifyAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    const email = 'admin@example.com';
    
    console.log('\nChecking admin user...');
    const admin = await User.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('No admin user found');
      return;
    }

    console.log('\nAdmin user details:');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    
    // Test password match
    console.log('\nTesting password match...');
    const isMatch = await admin.matchPassword('admin123');
    console.log(`Password 'admin123' matches: ${isMatch}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during admin verification:', error);
    process.exit(1);
  }
}

verifyAdmin();
