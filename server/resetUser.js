const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const resetUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to DB');

    const email = 'mohamedsubhan155@gmail.com';
    const result = await User.deleteOne({ email });

    if (result.deletedCount > 0) {
      console.log(`✅ Account RESET: ${email}`);
      console.log('   (User can now register again)');
    } else {
      console.log(`ℹ️ User not found (Account is already clean): ${email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetUser();
