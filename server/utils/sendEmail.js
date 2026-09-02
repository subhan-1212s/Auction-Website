const nodemailer = require('nodemailer');
const axios = require('axios');

const sendEmail = async (options) => {
  // Always log OTP prominently in console for dev debugging / backup access
  if (options.otp) {
    console.log('\n==========================================');
    console.log(`🔐 LOGIN OTP FOR ${options.email}: [ ${options.otp} ]`);
    console.log('==========================================\n');
  }

  // 1. Try Brevo HTTP API (Primary & works on both Local and Render)
  if (process.env.BREVO_API_KEY) {
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || 'mohamedsubhan155@gmail.com';
      await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: 'Smart Auction', email: senderEmail },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
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
      }, {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Real email successfully sent via Brevo to ${options.email}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Brevo API Error (${err.response?.data?.message || err.message}). Trying fallback...`);
    }
  }

  // 2. Try Gmail Nodemailer SMTP (Fallback)
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"Smart Auction" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
      });
      console.log(`✅ Email sent via Gmail SMTP to ${options.email}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Gmail SMTP failed (${err.message}).`);
    }
  }

  console.log(`ℹ️ Real email provider unavailable. Use the OTP printed above in the terminal: ${options.otp}`);
};

module.exports = sendEmail;
