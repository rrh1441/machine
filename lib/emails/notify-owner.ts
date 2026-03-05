import { gmail } from '@/lib/gmail/email-service';
import { emailTemplates } from './templates';

// Owner emails to notify on bookings
const OWNER_EMAILS = [
  'ryanrheger@gmail.com',
  'ryan@firstserveseattle.com'
];

export async function notifyOwnerOfBooking(
  customerEmail: string,
  customerName: string | null,
  bookingDatetime: Date,
  type: 'new' | 'reschedule' | 'cancel'
): Promise<void> {
  const emailContent = emailTemplates.ownerBookingNotification(
    customerEmail,
    customerName,
    bookingDatetime,
    type
  );

  for (const ownerEmail of OWNER_EMAILS) {
    try {
      await gmail.emails.send({
        from: 'Seattle Ball Machine <ryan@firstserveseattle.com>',
        to: ownerEmail,
        ...emailContent
      });
      console.log(`Sent ${type} notification to owner: ${ownerEmail}`);
    } catch (error) {
      console.error(`Failed to send ${type} notification to ${ownerEmail}:`, error);
    }
  }
}
