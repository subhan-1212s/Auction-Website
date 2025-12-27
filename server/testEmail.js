require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('🔄 Testing Email Configuration...');
  console.log('📧 Sender:', process.env.SMTP_EMAIL);
  // Mask password in log
  const pass = process.env.SMTP_PASSWORD;
  console.log('🔑 Password:', pass ? `${pass.substring(0, 2)}...${pass.substring(pass.length - 2)}` : 'MISSING');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection config
    await transporter.verify();
    console.log('✅ SMTP Connection Successful!');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Smart Auction Test" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Send to self
      subject: 'Smart Auction SMTP Test',
      text: 'If you see this, your email configuration is working correctly! 🚀',
    });

    console.log('✅ Test Email Sent!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Email Test Failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH' || error.response?.includes('535')) {
      console.log('\n⚠️  AUTHENTICATION ERROR:');
      console.log('It looks like the password may be incorrect or is a regular password.');
      console.log('Gmail requires an "App Password" (16 characters) if 2FA is enabled.');
      console.log('Please verify you generated an App Password from Google Security settings.');
    }
    process.exit(1);
  }
};

testEmail();
