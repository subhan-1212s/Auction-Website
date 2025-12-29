const axios = require('axios');

const sendEmail = async (options) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'mohamedsubhan155@gmail.com';

  // Always log OTP for Demo Bypass (Safe fallback)
  if (options.otp) {
    console.log('------------------------------------------');
    console.log(`🚀 AUTHENTICATION LOG: OTP for ${options.email} is ${options.otp}`);
    console.log('------------------------------------------');
  }

  // 1. Check if Brevo API Key exists
  if (!apiKey) {
    console.log('⚠️  BREVO_API_KEY not found. Real emails will not be sent.');
    console.log('📨 [DEV MODE] Email Content:');
    console.log(`   To: ${options.email} | Subject: ${options.subject}`);
    return;
  }

  // 2. Prepare Brevo API Payload
  const data = {
    sender: { name: 'Smart Auction', email: senderEmail },
    to: [{ email: options.email }],
    subject: options.subject,
    htmlContent: options.html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">${options.subject}</h2>
        <p style="font-size: 16px; color: #333;">${options.message}</p>
        ${options.otp ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1a1a1a; letter-spacing: 5px; margin: 0;">${options.otp}</h1>
        </div>
        <p style="font-size: 14px; color: #666;">This code expires in 10 minutes.</p>
        ` : ''}
      </div>
    `
  };

  // 3. Send via HTTP API (Bypasses Render SMTP Block)
  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ Real Email sent via Brevo to ${options.email}`);
  } catch (err) {
    console.error('❌ Brevo API Error:', err.response?.data || err.message);
  }
};

module.exports = sendEmail;
