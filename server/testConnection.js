require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Testing MongoDB Atlas Connection...');
console.log('━'.repeat(60));
console.log(`📍 Your IP: 59.98.125.60`);
console.log(`🔗 Connecting to: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
console.log('━'.repeat(60));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // 10 second timeout
})
.then(() => {
  console.log('\n✅ SUCCESS! MongoDB Atlas connection established!');
  console.log('━'.repeat(60));
  console.log('✓ Database is accessible');
  console.log('✓ Credentials are correct');
  console.log('✓ Network access is configured');
  console.log('━'.repeat(60));
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.log('\n❌ CONNECTION FAILED!');
  console.log('━'.repeat(60));
  console.error('Error:', err.message);
  console.log('\n📋 Troubleshooting Steps:');
  console.log('1. Go to MongoDB Atlas → Network Access');
  console.log('2. Add IP Address: 59.98.125.60');
  console.log('   OR use 0.0.0.0/0 to allow all IPs (for testing)');
  console.log('3. Verify database user has read/write permissions');
  console.log('4. Check if password contains special characters');
  console.log('━'.repeat(60));
  process.exit(1);
});
