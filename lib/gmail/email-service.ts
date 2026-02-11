import { resend } from '@/lib/resend/client';

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
      if (!resend) {
        console.error('Resend client not initialized - missing RESEND_API_KEY');
        return { error: 'Email service not configured' };
      }

      try {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });

        if (error) {
          console.error('Failed to send email via Resend:', error);
          return { error };
        }

        console.log('Email sent via Resend to:', options.to);
        return { data };
      } catch (error) {
        console.error('Failed to send email via Resend:', error);
        return { error };
      }
    }
  }
};
