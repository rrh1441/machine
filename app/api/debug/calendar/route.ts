import { NextRequest, NextResponse } from 'next/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Debug endpoint to see ALL sources blocking availability
 * GET /api/debug/calendar?date=2025-01-08
 */
export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get('date');
  const date = dateParam || new Date().toISOString().split('T')[0];

  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  const dayStart = new Date(`${date}T00:00:00-08:00`);
  const dayEnd = new Date(`${date}T23:59:59-08:00`);

  const result: Record<string, unknown> = {
    calendarId,
    date,
    queryRange: {
      start: dayStart.toISOString(),
      end: dayEnd.toISOString()
    }
  };

  // 1. Check blocked_times table
  if (supabaseAdmin) {
    const { data: blockedTimes, error: blockedError } = await supabaseAdmin
      .from('blocked_times')
      .select('*')
      .lt('start_datetime', dayEnd.toISOString())
      .gt('end_datetime', dayStart.toISOString());

    result.blockedTimes = blockedError ? { error: blockedError.message } : blockedTimes;

    // 2. Check bookings table
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_date', date);

    result.bookings = bookingsError ? { error: bookingsError.message } : bookings;
  } else {
    result.dbError = 'Supabase not configured';
  }

  // 3. Check Google Calendar (with timeout)
  const client = createGoogleCalendarClient();
  if (client) {
    const timeout = (ms: number) => new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    );

    try {
      const busyPeriods = await Promise.race([
        client.getFreeBusy(dayStart, dayEnd),
        timeout(5000)
      ]) as Awaited<ReturnType<typeof client.getFreeBusy>>;

      result.googleBusyPeriods = busyPeriods.map(p => ({
        start: p.start.toISOString(),
        startLocal: p.start.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }),
        end: p.end.toISOString(),
        endLocal: p.end.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })
      }));
    } catch (error) {
      result.googleBusyPeriods = { error: String(error) };
    }

    try {
      const events = await Promise.race([
        client.listEvents(dayStart, dayEnd),
        timeout(5000)
      ]) as Awaited<ReturnType<typeof client.listEvents>>;

      result.googleEvents = events.map(e => ({
        id: e.id,
        summary: e.summary,
        status: e.status,
        start: e.start?.dateTime,
        end: e.end?.dateTime
      }));
    } catch (error) {
      result.googleEvents = { error: String(error) };
    }
  } else {
    result.googleCalendar = { error: 'Client not configured' };
  }

  return NextResponse.json(result);
}
