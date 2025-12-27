const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to DB');

    const email = 'mohamedsubhan155@gmail.com';
    const user = await User.findOne({ email });

    if (user) {
      console.log('✅ User FOUND:', user.email);
      console.log('   Name:', user.name);
      console.log('   Role:', user.role);
      console.log('   OTP Status:', user.otp ? 'Active' : 'None');
    } else {
      console.log('❌ User NOT found:', email);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();
