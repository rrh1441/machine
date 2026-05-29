/**
 * One-off: jzh1845096839@qq.com paid for 3 sessions but meant to use zj7833hao@gmail.com.
 *
 *  1. Zero out qq.com credits, give gmail.com 3 fresh credits
 *  2. Send purchase confirmation email to gmail.com
 *  3. Book a custom 3-hour session 10am-1pm Seattle on 2026-05-14 (deducts 1 credit)
 *  4. Create Google Calendar event, send booking confirmation email
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/transfer-credits-and-book.ts            # dry run
 *   npx tsx --env-file=.env.local scripts/transfer-credits-and-book.ts --apply    # execute
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { google } from 'googleapis';

const APPLY = process.argv.includes('--apply');

const SRC_EMAIL = 'jzh1845096839@qq.com';
const DST_EMAIL = 'zj7833hao@gmail.com';
const BOOKING_DATE = '2026-05-14';
const BOOKING_TIME = '10:00';
const BOOKING_DURATION_HOURS = 3;
const CREDITS_TO_GRANT = 3;
const CREDITS_PER_BOOKING = 1;
const PICKUP_LOCATION = '2116 4th Avenue West, Seattle, WA 98119';
const FROM_EMAIL = 'Seattle Ball Machine <ryan@firstserveseattle.com>';

// Seattle is PDT (UTC-7) on 2026-05-14
const BOOKING_START_UTC = new Date('2026-05-14T17:00:00.000Z'); // 10:00 PDT
const BOOKING_END_UTC = new Date('2026-05-14T20:00:00.000Z');   // 13:00 PDT

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

function calendarClient() {
  const oauth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI || 'http://localhost:3333/api/auth/gmail/callback'
  );
  oauth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return {
    cal: google.calendar({ version: 'v3', auth: oauth }),
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  };
}

function log(label: string, val: unknown) {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(val, null, 2));
}

async function getCustomer(email: string) {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  return data;
}

async function getCredits(customerId: string) {
  const { data } = await supabase
    .from('session_credits')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true });
  return data || [];
}

function purchaseEmailHtml(sessions: number) {
  const base = process.env.NEXT_PUBLIC_URL || 'https://www.seattleballmachine.com';
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#fff;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:30px;"><span style="color:#059669;font-size:24px;font-weight:bold;">Seattle Ball Machine</span></td></tr>
        <tr><td style="padding-bottom:25px;"><h1 style="margin:0;font-size:28px;font-weight:bold;color:#111827;">Thank you for your purchase!</h1></td></tr>
        <tr><td style="padding-bottom:25px;color:#374151;font-size:17px;line-height:1.6;">
          <strong>${sessions} session${sessions > 1 ? 's' : ''}</strong> (2 hours each) with 65 balls + basket.
        </td></tr>
        <tr><td style="padding-bottom:30px;">
          <a href="${base}/book" style="display:inline-block;padding:14px 28px;background:#059669;color:#fff;text-decoration:none;font-weight:bold;font-size:17px;border-radius:6px;">Schedule Your First Session</a>
        </td></tr>
        <tr><td style="padding:25px 0;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Pickup Location</p>
          <p style="margin:0;font-size:17px;color:#111827;">${PICKUP_LOCATION}</p>
          <p style="margin:5px 0 0 0;font-size:15px;color:#6b7280;">Equipment will be ready on the porch</p>
        </td></tr>
        <tr><td style="padding-top:25px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:15px;">
          Questions? <a href="mailto:support@firstserveseattle.com" style="color:#059669;text-decoration:none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color:#059669;text-decoration:none;">(253) 252-9577</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function bookingEmailHtml(opts: {
  startUtc: Date;
  endUtc: Date;
  sessionsRemaining: number;
  rescheduleUrl: string;
  cancelUrl: string;
}) {
  const fmtDate = opts.startUtc.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles',
  });
  const fmtStart = opts.startUtc.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles',
  });
  const fmtEnd = opts.endUtc.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles',
  });
  const base = process.env.NEXT_PUBLIC_URL || 'https://www.seattleballmachine.com';
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#fff;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:30px;"><span style="color:#059669;font-size:24px;font-weight:bold;">Seattle Ball Machine</span></td></tr>
        <tr><td style="padding-bottom:8px;"><h1 style="margin:0;font-size:28px;font-weight:bold;color:#111827;">You're all set!</h1></td></tr>
        <tr><td style="padding-bottom:25px;">
          <p style="margin:0;font-size:22px;color:#111827;font-weight:600;">${fmtDate}</p>
          <p style="margin:8px 0 0 0;font-size:18px;color:#111827;">${fmtStart} - ${fmtEnd} (extended 3-hour session)</p>
          <p style="margin:8px 0 0 0;font-size:15px;color:#6b7280;">3 hours &bull; 65 balls + basket &bull; ${opts.sessionsRemaining} session${opts.sessionsRemaining !== 1 ? 's' : ''} remaining</p>
        </td></tr>
        <tr><td style="padding:25px 0;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Pickup Location</p>
          <p style="margin:0;font-size:17px;color:#111827;">${PICKUP_LOCATION}</p>
          <p style="margin:5px 0 0 0;font-size:15px;color:#6b7280;">Equipment will be ready on the porch</p>
        </td></tr>
        <tr><td style="padding-bottom:25px;">
          <a href="${base}/guide" style="color:#059669;font-size:15px;text-decoration:none;">View setup guide &rarr;</a>
        </td></tr>
        <tr><td style="padding-bottom:25px;">
          <a href="${opts.rescheduleUrl}" style="color:#3b82f6;font-size:15px;text-decoration:none;margin-right:20px;">Reschedule</a>
          <a href="${opts.cancelUrl}" style="color:#ef4444;font-size:15px;text-decoration:none;">Cancel booking</a>
        </td></tr>
        <tr><td style="padding-top:25px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:15px;">
          Questions? <a href="mailto:support@firstserveseattle.com" style="color:#059669;text-decoration:none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color:#059669;text-decoration:none;">(253) 252-9577</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function main() {
  console.log(`\nMode: ${APPLY ? 'APPLY (live writes)' : 'DRY RUN (read only)'}`);
  console.log(`Source: ${SRC_EMAIL}`);
  console.log(`Destination: ${DST_EMAIL}`);
  console.log(`Booking: ${BOOKING_DATE} ${BOOKING_TIME} for ${BOOKING_DURATION_HOURS}h`);

  const srcCustomer = await getCustomer(SRC_EMAIL);
  if (!srcCustomer) {
    console.error(`\nNo customer found for ${SRC_EMAIL}. Aborting.`);
    process.exit(1);
  }
  log('Source customer', srcCustomer);

  const srcCredits = await getCredits(srcCustomer.id);
  log('Source credits', srcCredits);
  const srcTotal = srcCredits.reduce((s, c) => s + (c.sessions_remaining || 0), 0);
  console.log(`Source remaining: ${srcTotal}`);

  let dstCustomer = await getCustomer(DST_EMAIL);
  if (dstCustomer) {
    log('Destination customer (exists)', dstCustomer);
    const dstCredits = await getCredits(dstCustomer.id);
    log('Destination existing credits', dstCredits);
  } else {
    console.log(`\nDestination customer ${DST_EMAIL} does not exist yet — will create.`);
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to execute.');
    return;
  }

  // 1. Zero out qq credits
  for (const c of srcCredits) {
    if (c.sessions_remaining > 0) {
      const { error } = await supabase
        .from('session_credits')
        .update({ sessions_remaining: 0 })
        .eq('id', c.id);
      if (error) throw new Error(`Failed to zero qq credit ${c.id}: ${error.message}`);
      console.log(`Zeroed qq credit ${c.id} (was ${c.sessions_remaining})`);
    }
  }

  // 2. Upsert destination customer (preserve name/phone from src, no stripe id since they didn't pay under this email)
  if (!dstCustomer) {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        email: DST_EMAIL.toLowerCase(),
        name: srcCustomer.name,
        phone: srcCustomer.phone,
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create dst customer: ${error.message}`);
    dstCustomer = data;
    console.log(`Created destination customer ${dstCustomer!.id}`);
  }

  // 3. Add 3-session credit (1 year expiry, matching default)
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  const { data: newCredit, error: credErr } = await supabase
    .from('session_credits')
    .insert({
      customer_id: dstCustomer!.id,
      sessions_remaining: CREDITS_TO_GRANT,
      sessions_total: CREDITS_TO_GRANT,
      expires_at: expires.toISOString(),
    })
    .select()
    .single();
  if (credErr) throw new Error(`Failed to create credit: ${credErr.message}`);
  console.log(`Created credit ${newCredit.id} with ${CREDITS_TO_GRANT} sessions`);

  // 4. Send purchase confirmation
  const purchaseEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: DST_EMAIL,
    subject: 'Your Seattle Ball Machine Rental is Confirmed!',
    html: purchaseEmailHtml(CREDITS_TO_GRANT),
  });
  if (purchaseEmail.error) throw new Error(`Purchase email failed: ${JSON.stringify(purchaseEmail.error)}`);
  console.log(`Sent purchase confirmation: ${purchaseEmail.data?.id}`);

  // 5. Create Google Calendar event (10am-1pm PDT 5/14/2026)
  const { cal, calendarId } = calendarClient();
  const calEvent = await cal.events.insert({
    calendarId,
    sendUpdates: 'all',
    requestBody: {
      summary: `Ball Machine Rental - ${dstCustomer!.name || DST_EMAIL}`,
      description: `3-hour ball machine rental session.\n\nCustomer: ${dstCustomer!.name || 'N/A'}\nEmail: ${DST_EMAIL}\n\n(Manually credited — original purchase under ${SRC_EMAIL})`,
      location: PICKUP_LOCATION,
      start: { dateTime: BOOKING_START_UTC.toISOString(), timeZone: 'America/Los_Angeles' },
      end: { dateTime: BOOKING_END_UTC.toISOString(), timeZone: 'America/Los_Angeles' },
      attendees: [{ email: DST_EMAIL }],
    },
  });
  const eventId = calEvent.data.id!;
  console.log(`Created calendar event ${eventId}`);

  // 6. Insert booking record
  const { data: booking, error: bookErr } = await supabase
    .from('bookings')
    .insert({
      customer_id: dstCustomer!.id,
      booking_date: BOOKING_DATE,
      booking_time: `${BOOKING_TIME}:00`,
      booking_datetime: BOOKING_START_UTC.toISOString(),
      duration_hours: BOOKING_DURATION_HOURS,
      status: 'scheduled',
      booking_source: 'native',
      google_calendar_event_id: eventId,
    })
    .select()
    .single();
  if (bookErr) throw new Error(`Booking insert failed: ${bookErr.message}`);
  console.log(`Created booking ${booking.id}`);

  // 7. Deduct 1 credit + record usage
  const { error: deductErr } = await supabase
    .from('session_credits')
    .update({ sessions_remaining: CREDITS_TO_GRANT - CREDITS_PER_BOOKING })
    .eq('id', newCredit.id);
  if (deductErr) throw new Error(`Deduct failed: ${deductErr.message}`);

  const { error: usageErr } = await supabase
    .from('session_usage')
    .insert({
      booking_id: booking.id,
      session_credit_id: newCredit.id,
      sessions_used: CREDITS_PER_BOOKING,
    });
  if (usageErr) console.warn(`session_usage insert warning: ${usageErr.message}`);

  // 8. Send booking confirmation
  const base = process.env.NEXT_PUBLIC_URL || 'https://www.seattleballmachine.com';
  const bookEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: DST_EMAIL,
    subject: 'Booking Confirmed - Seattle Ball Machine',
    html: bookingEmailHtml({
      startUtc: BOOKING_START_UTC,
      endUtc: BOOKING_END_UTC,
      sessionsRemaining: CREDITS_TO_GRANT - CREDITS_PER_BOOKING,
      rescheduleUrl: `${base}/book/reschedule?id=${booking.id}`,
      cancelUrl: `${base}/book/cancel?id=${booking.id}`,
    }),
  });
  if (bookEmail.error) throw new Error(`Booking email failed: ${JSON.stringify(bookEmail.error)}`);
  console.log(`Sent booking confirmation: ${bookEmail.data?.id}`);

  console.log('\nDone.');
}

main().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
