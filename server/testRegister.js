const axios = require('axios');

const testRegister = async () => {
  try {
    console.log('🔄 Testing Registration API...');
    
    // Randomize email to avoid "User already exists"
    const randomNum = Math.floor(Math.random() * 10000);
    const payload = {
      name: "Debug User",
      email: `debug.user.${randomNum}@gmail.com`,
      password: "StrongPassword123!"
    };

    console.log('📤 Sending payload:', payload);

    const res = await axios.post('http://localhost:5000/api/auth/register', payload);
    console.log('✅ Registration SUCCESS:', res.data);

  } catch (error) {
    console.error('❌ Registration FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testRegister();
