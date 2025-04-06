require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function validateAdmin() {
  try {
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('2. MongoDB connected successfully');

    console.log('3. Querying admin user directly...');
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({email: 'admin@example.com'});
    
    if (!user) {
      console.log('4. ERROR: No admin user found in database');
      return;
    }

    console.log('5. Admin user found in database:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role || 'undefined'}`);
    
    console.log('6. Verifying password hash...');
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log(`7. Password 'admin123' matches: ${isMatch}`);

    if (!isMatch) {
      console.log('8. Resetting admin password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await db.collection('users').updateOne(
        {email: 'admin@example.com'},
        {$set: {password: hashedPassword, role: 'admin'}}
      );
      console.log('9. Admin password and role updated successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

validateAdmin();
