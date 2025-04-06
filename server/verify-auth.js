require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testAuth() {
  try {
    // 1. Verify database connection
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('2. MongoDB connected successfully');

    // 2. Verify admin user exists
    console.log('3. Checking admin user...');
    const admin = await mongoose.connection.db.collection('users')
      .findOne({email: 'admin@example.com'});
    
    if (!admin) {
      console.log('4. ERROR: Admin user not found');
      return;
    }

    console.log('5. Admin user exists:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role || 'undefined'}`);

    // 3. Verify password
    console.log('6. Verifying password...');
    const validPassword = await bcrypt.compare('admin123', admin.password);
    console.log(`7. Password valid: ${validPassword}`);

    if (!validPassword) {
      console.log('8. Resetting admin password...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt);
      await mongoose.connection.db.collection('users')
        .updateOne({email: 'admin@example.com'}, {$set: {password: hash}});
      console.log('9. Password reset complete');
    }

    // 4. Verify JWT generation
    console.log('10. Testing JWT generation...');
    const token = jwt.sign({id: admin._id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    console.log('11. JWT generated successfully');

    // 5. Test API endpoint
    console.log('12. Testing API login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('13. Login successful! Response:');
    console.log({
      status: response.status,
      data: {
        ...response.data,
        token: response.data.token ? '*****' : 'Missing'
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    process.exit(1);
  }
}

testAuth();
