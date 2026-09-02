const axios = require('axios');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Always log OTP in console for dev debugging / backup access
  if (options.otp) {
    console.log('\n==========================================');
    console.log(`🔐 LOGIN OTP FOR ${options.email}: [ ${options.otp} ]`);
    console.log('==========================================\n');
  }

  const htmlTemplate = options.html || `
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
  `;

  // 1. Primary Engine: Brevo HTTP API (Official Production Provider)
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'mohamedsubhan155@gmail.com';

  if (brevoApiKey) {
    try {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: 'Smart Auction', email: senderEmail },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: htmlTemplate
      }, {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Email successfully dispatched via Brevo to ${options.email} (ID: ${response.data?.messageId})`);
      return response.data;
    } catch (err) {
      console.warn(`⚠️ Brevo API Error (${err.response?.data?.message || err.message}). Trying Gmail SMTP fallback...`);
    }
  }

  // 2. Fallback Engine: Gmail SMTP
  const smtpEmail = process.env.SMTP_EMAIL || 'mohamedsubhan155@gmail.com';
  const smtpPassword = process.env.SMTP_PASSWORD || 'ykxn huad ageh eulr';

  if (smtpEmail && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpEmail,
          pass: smtpPassword
        }
      });

      const info = await transporter.sendMail({
        from: `"Smart Auction" <${smtpEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: htmlTemplate
      });
      console.log(`✅ Email sent via Gmail SMTP fallback to ${options.email} (ID: ${info.messageId})`);
      return info;
    } catch (err) {
      console.error(`❌ Gmail SMTP fallback error (${err.message}).`);
    }
  }
};

module.exports = sendEmail;
