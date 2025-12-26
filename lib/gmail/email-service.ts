import { createGmailClient } from './client';

const FROM_EMAIL = 'Seattle Ball Machine <ryan@firstserveseattle.com>';

interface EmailContent {
  subject: string;
  html: string;
}

export const gmail = {
  emails: {
    async send(options: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) {
      const client = createGmailClient();
      if (!client) {
        console.error('Gmail client not initialized');
        return { error: 'Gmail not configured' };
      }

      try {
        const result = await client.sendEmail({
          from: FROM_EMAIL, // Always use our authenticated address
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        console.log('Email sent via Gmail to:', options.to);
        return { data: result };
      } catch (error) {
        console.error('Failed to send email via Gmail:', error);
        return { error };
      }
    }
  }
};
