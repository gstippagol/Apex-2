const { Resend } = require('resend');

const sendEmail = async (options) => {
  const Settings = require('../models/Settings');
  const settings = await Settings.findOne();
  if (settings && settings.isEmailEnabled === false) {
    console.log('Email services are globally disabled in Settings. Skipping email to:', options.email || options.to);
    return { skipped: true };
  }

  // Validate environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY environment variable is missing.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromName = process.env.FROM_NAME || "APEX Club";
  
  // Note: For Resend, you generally need a verified domain. 
  // If you don't have one, you can use onboarding@resend.dev but it only sends to the email you registered with.
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  const message = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email || options.to,
    bcc: options.bcc, 
    subject: options.subject,
    html: options.html, // Resend prefers HTML
    text: options.message,
  };

  // Retry handling
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await resend.emails.send(message);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Message sent successfully via Resend on attempt %d: %s', attempt, data.id);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed to send email via Resend:`, error.message);
      if (attempt === maxRetries) {
        console.error('All retry attempts failed. Could not send email via Resend.');
        throw error;
      }
      // Delay before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

module.exports = sendEmail;
