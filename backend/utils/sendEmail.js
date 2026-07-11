const sendEmail = async (options) => {
  const Settings = require('../models/Settings');
  const settings = await Settings.findOne();
  if (settings && settings.isEmailEnabled === false) {
    console.log('Email services are globally disabled in Settings. Skipping email to:', options.email || options.to);
    return { skipped: true };
  }

  // Validate environment variables
  if (!process.env.BREVO_API_KEY) {
    console.error('ERROR: BREVO_API_KEY environment variable is missing.');
    return { success: false, error: 'BREVO_API_KEY missing' };
  }

  const fromName = process.env.FROM_NAME || "APEX Club";
  const fromEmail = process.env.FROM_EMAIL || "apex.muse2026@gmail.com"; 

  const payload = {
    sender: { name: fromName, email: fromEmail },
    to: [{ email: options.email || options.to }],
    subject: options.subject,
    htmlContent: options.html,
    textContent: options.message
  };

  if (options.bcc) {
      payload.bcc = [{ email: options.bcc }];
  }

  // Retry handling
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      
      const data = await response.json();
      console.log('Message sent successfully via Brevo on attempt %d: %s', attempt, data.messageId);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed to send email via Brevo:`, error.message);
      if (attempt === maxRetries) {
        console.error('All retry attempts failed. Could not send email via Brevo.');
        throw error;
      }
      // Delay before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

module.exports = sendEmail;
