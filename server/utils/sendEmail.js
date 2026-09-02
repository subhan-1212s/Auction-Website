const nodemailer = require('nodemailer');
const axios = require('axios');

const sendEmail = async (options) => {
  // Always log OTP prominently in console for dev debugging / backup access
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

  // 1. Primary Engine: Dedicated Gmail SMTP (1 Second Direct Delivery to Recipient Inbox)
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

      await transporter.sendMail({
        from: `"Smart Auction" <${smtpEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: htmlTemplate
      });
      console.log(`✅ Instant email sent via Gmail SMTP directly to ${options.email}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Gmail SMTP warning (${err.message}). Trying Brevo API...`);
    }
  }

  // 2. Fallback Engine: Brevo HTTP API
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || smtpEmail;

  if (brevoApiKey) {
    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', {
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
      console.log(`✅ Email sent via Brevo fallback to ${options.email}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Brevo API fallback error (${err.response?.data?.message || err.message}).`);
    }
  }

  console.log(`ℹ️ Email logged to console. Use OTP: ${options.otp}`);
};

module.exports = sendEmail;
