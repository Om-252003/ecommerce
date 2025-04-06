const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create sample categories
const categories = [
  { name: 'Electronics' },
  { name: 'Clothing' },
  { name: 'Books' },
  { name: 'Home & Kitchen' }
];

// Create admin user and sample data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created:');
    console.log(`Email: admin@example.com`);
    console.log(`Password: admin123`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    // Create sample products
    const products = [
      {
        name: 'Smartphone XYZ',
        description: 'Latest smartphone with amazing features',
        price: 699.99,
        category: createdCategories[0]._id,
        countInStock: 15,
        image: 'https://via.placeholder.com/300',
        createdBy: adminUser._id
      },
      {
        name: 'Laptop Pro',
        description: 'High performance laptop for professionals',
        price: 1299.99,
        category: createdCategories[0]._id,
        countInStock: 8,
        image: 'https://via.placeholder.com/300',
        createdBy: adminUser._id
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        category: createdCategories[1]._id,
        countInStock: 50,
        image: 'https://via.placeholder.com/300',
        createdBy: adminUser._id
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'A book about JavaScript best practices',
        price: 29.99,
        category: createdCategories[2]._id,
        countInStock: 20,
        image: 'https://via.placeholder.com/300',
        createdBy: adminUser._id
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('Data Import Success');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
