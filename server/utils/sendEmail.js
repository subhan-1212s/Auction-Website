const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Check if SMTP credentials exist; if not, use Dev Mode (log to console)
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('⚠️  SMTP Credentials not found in .env');
    console.log('📨 [DEV MODE] Email Simulation');
    console.log(`   To:      ${options.email}`);
    console.log(`   Subject: ${options.subject}`);
    console.log(`   Message: ${options.message}`);
    console.log('   (To send real emails, add SMTP_EMAIL and SMTP_PASSWORD to .env)');
    return;
  }

  // 2. Create Transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 3. Define Email Options
  const mailOptions = {
    from: `"Smart Auction" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || options.text,
    html: options.html || `
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

  // 4. Send Email
  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${options.email}`);
};

module.exports = sendEmail;
