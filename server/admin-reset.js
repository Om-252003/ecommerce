require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function resetAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    const email = 'admin@example.com';
    const password = 'admin123';
    
    console.log('\nChecking existing admin user...');
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user found:', existingAdmin);
    } else {
      console.log('No admin user found, will create new one');
    }

    console.log('\nResetting admin credentials...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await User.findOneAndUpdate(
      { email },
      {
        name: 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin'
      },
      { new: true, upsert: true }
    );

    console.log('\nAdmin credentials updated successfully!');
    console.log('Login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during admin reset:', error);
    process.exit(1);
  }
}

resetAdmin();
