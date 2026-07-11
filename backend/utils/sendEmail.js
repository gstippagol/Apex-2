const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const Settings = require('../models/Settings');
  const settings = await Settings.findOne();
  if (settings && settings.isEmailEnabled === false) {
    console.log('Email services are globally disabled in Settings. Skipping email to:', options.email || options.to);
    return { skipped: true };
  }

  // Validate environment variables
  if (!process.env.EMAIL_USER && !process.env.SMTP_EMAIL) {
    console.error('ERROR: EMAIL_USER environment variable is missing.');
  }
  if (!process.env.EMAIL_PASS && !process.env.SMTP_PASSWORD) {
    console.error('ERROR: EMAIL_PASS environment variable is missing. A Gmail App Password is required.');
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS requires secure: false for port 587
    family: 4, // Force IPv4
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
      pass: process.env.EMAIL_PASS || process.env.SMTP_PASSWORD, // Must be Gmail App Password
    },
    connectionTimeout: 10000 // 10 seconds timeout to prevent infinite buffering
  });

  // Verify connection configuration
  try {
    await transporter.verify();
    console.log('SMTP Connection successful. Transporter ready.');
  } catch (error) {
    console.error('SMTP Verification Failed:', error);
    if (error.code === 'ENETUNREACH') {
      console.error('Network unreachable (IPv6 issue). Ensure family: 4 is applied.');
    }
  }

  const fromName = process.env.FROM_NAME || "APEX Club";
  const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.SMTP_EMAIL;

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email || options.to, 
    bcc: options.bcc, // Added BCC support for privacy
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Retry handling
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(message);
      console.log('Message sent successfully on attempt %d: %s', attempt, info.messageId);
      return info;
    } catch (error) {
      console.error(`Attempt ${attempt} failed to send email:`, error.message);
      if (attempt === maxRetries) {
        console.error('All retry attempts failed. Could not send email.');
        throw error;
      }
      // Delay before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

module.exports = sendEmail;
