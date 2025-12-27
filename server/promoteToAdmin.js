require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2] || 'mohamedsubhan155@gmail.com';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`✅ Success: ${email} is now an ADMIN.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
