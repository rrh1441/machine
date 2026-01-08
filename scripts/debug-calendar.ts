/**
 * Debug script to see what Google Calendar returns as busy periods
 * Run with: npx tsx scripts/debug-calendar.ts 2025-01-08
 */

import { google } from 'googleapis';

async function debugCalendar(dateStr: string) {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  console.log('=== Calendar Debug ===');
  console.log('Calendar ID:', calendarId);
  console.log('Date:', dateStr);
  console.log('');

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('Missing credentials');
    return;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const dayStart = new Date(`${dateStr}T00:00:00-08:00`);
  const dayEnd = new Date(`${dateStr}T23:59:59-08:00`);

  console.log('Query range:');
  console.log('  Start:', dayStart.toISOString());
  console.log('  End:', dayEnd.toISOString());
  console.log('');

  // Get freebusy info
  console.log('=== FreeBusy Response ===');
  try {
    const freebusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        items: [{ id: calendarId }]
      }
    });

    const busyPeriods = freebusyResponse.data.calendars?.[calendarId]?.busy || [];
    console.log('Busy periods found:', busyPeriods.length);

    if (busyPeriods.length > 0) {
      busyPeriods.forEach((period, i) => {
        const start = new Date(period.start!);
        const end = new Date(period.end!);
        console.log(`  ${i + 1}. ${start.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })} - ${end.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })}`);
      });
    } else {
      console.log('  (none)');
    }

    // Check for errors in the response
    const errors = freebusyResponse.data.calendars?.[calendarId]?.errors;
    if (errors && errors.length > 0) {
      console.log('Errors:', errors);
    }
  } catch (error) {
    console.error('FreeBusy error:', error);
  }

  // List actual events
  console.log('');
  console.log('=== Actual Events on Calendar ===');
  try {
    const eventsResponse = await calendar.events.list({
      calendarId,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = eventsResponse.data.items || [];
    console.log('Events found:', events.length);

    if (events.length > 0) {
      events.forEach((event, i) => {
        const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
        const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;
        console.log(`  ${i + 1}. "${event.summary}"`);
        console.log(`     Status: ${event.status}`);
        console.log(`     Time: ${start?.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })} - ${end?.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })}`);
        if (event.transparency) console.log(`     Transparency: ${event.transparency}`);
      });
    } else {
      console.log('  (none)');
    }
  } catch (error) {
    console.error('Events list error:', error);
  }
}

const dateArg = process.argv[2] || new Date().toISOString().split('T')[0];
debugCalendar(dateArg);
