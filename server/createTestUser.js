require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

async function createTestUser() {
  try {
    console.log('🔄 Creating test user...\n');

    // Check if test user already exists
    let existingUser = await User.findOne({ email: 'test@test.com' });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists!');
      console.log(`   Email: test@test.com`);
      console.log(`   Password: Test@123\n`);
      
      // Delete and recreate
      await User.deleteOne({ email: 'test@test.com' });
      console.log('🗑️  Deleted existing test user\n');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'user',
      isApproved: true
    });

    console.log('✅ Test user created successfully!\n');
    console.log('━'.repeat(60));
    console.log('📧 Email:    test@test.com');
    console.log('🔑 Password: Test@123');
    console.log('👤 Name:     Test User');
    console.log('🎭 Role:     user');
    console.log('━'.repeat(60));
    console.log('\n🌐 You can now login at: http://localhost:5173/login\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating test user:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

console.log('🚀 Smart Auction - Test User Creator');
console.log('━'.repeat(60));
createTestUser();
