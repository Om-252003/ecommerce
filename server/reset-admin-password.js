const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const resetPassword = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const result = await User.updateOne(
      { email: 'admin@example.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin'
        }
      }
    );

    if (result.modifiedCount === 0) {
      console.log('No admin user found with email admin@example.com');
    } else {
      console.log('Admin password reset successfully');
      console.log('New credentials:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

resetPassword();
