const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Always log OTP in console for dev debugging / backup access
  if (options.otp) {
    console.log('\n==========================================');
    console.log(`🔐 LOGIN OTP FOR ${options.email}: [ ${options.otp} ]`);
    console.log('==========================================\n');
  }

  const smtpEmail = process.env.SMTP_EMAIL || 'mohamedsubhan155@gmail.com';
  const smtpPassword = process.env.SMTP_PASSWORD || 'ykxn huad ageh eulr';

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

    console.log(`✅ Email sent via Gmail SMTP to ${options.email} (ID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`❌ Gmail SMTP Error (${err.message}).`);
    throw err;
  }
};

module.exports = sendEmail;
