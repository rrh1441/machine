/**
 * Google Calendar -> database sync.
 *
 * Source of truth is Google Calendar: if you move or cancel a booking's event
 * directly in Calendar (instead of through the app's reschedule/cancel routes),
 * this reconciles the `bookings` table to match.
 *
 *   - MOVE:   event start changed  -> update booking_date / booking_time / booking_datetime
 *   - CANCEL: event deleted (404/410) or status 'cancelled'
 *             -> mark booking 'cancelled' AND refund the session credit
 *               (mirrors app/api/booking/cancel/route.ts)
 *
 * No customer emails are sent — Google Calendar already notifies the attendee
 * when you move/cancel an event. Idempotent: only acts on scheduled native
 * bookings, so re-running never double-applies.
 *
 * Dependencies are injected (supabase client + calendar client) so this module
 * has no app-internal imports and can be exercised directly from a script.
 */

import type { calendar_v3 } from 'googleapis';

const TIMEZONE = 'America/Los_Angeles';
const SLOT_DURATION_HOURS = 2;
const MATCH_TOLERANCE_MS = 60_000; // treat sub-minute differences as "unchanged"

// Minimal shapes of the injected clients (avoids importing app singletons/types).
interface CalendarLike {
  getEvent(eventId: string): Promise<calendar_v3.Schema$Event>;
}
// The Supabase client is passed through untyped; its query builder is fluent.
type SupabaseLike = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};

interface BookingRow {
  id: string;
  customer_id: string;
  booking_date: string;
  booking_time: string;
  booking_datetime: string;
  duration_hours: number | null;
  status: string;
  google_calendar_event_id: string;
  booking_source: string;
}

export interface SyncMove {
  bookingId: string;
  eventId: string;
  fromLocal: string;
  toLocal: string;
  from: string;
  to: string;
}

export interface SyncCancel {
  bookingId: string;
  eventId: string;
  reason: 'event_deleted' | 'event_cancelled';
  creditRefunded: boolean;
}

export interface SyncResult {
  dryRun: boolean;
  scanned: number;
  eventGroups: number;
  unchanged: number;
  moved: SyncMove[];
  cancelled: SyncCancel[];
  errors: Array<{ eventId: string; error: string }>;
}

export interface SyncOptions {
  dryRun?: boolean;
  /** How far back (hours) to still consider a booking for syncing. Default 12. */
  lookbackHours?: number;
}

/** Derive Seattle-local YYYY-MM-DD and HH:MM:00 from a UTC instant. */
function seattleLocalParts(instant: Date): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(instant);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  let hour = get('hour');
  if (hour === '24') hour = '00'; // some runtimes emit '24' for midnight
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${hour}:${get('minute')}:00`,
  };
}

async function refundCredit(supabase: SupabaseLike, bookingId: string): Promise<boolean> {
  const { data: usage } = await supabase
    .from('session_usage')
    .select('session_credit_id, sessions_used')
    .eq('booking_id', bookingId)
    .maybeSingle();

  if (!usage) return false;

  const { data: credit } = await supabase
    .from('session_credits')
    .select('sessions_remaining')
    .eq('id', usage.session_credit_id)
    .single();

  if (!credit) return false;

  await supabase
    .from('session_credits')
    .update({ sessions_remaining: (credit.sessions_remaining || 0) + (usage.sessions_used || 1) })
    .eq('id', usage.session_credit_id);

  return true;
}

export async function syncCalendarToDb(
  supabase: SupabaseLike,
  calendar: CalendarLike,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const dryRun = !!options.dryRun;
  const lookbackHours = options.lookbackHours ?? 12;
  const windowStart = new Date(Date.now() - lookbackHours * 3600 * 1000).toISOString();

  const result: SyncResult = {
    dryRun,
    scanned: 0,
    eventGroups: 0,
    unchanged: 0,
    moved: [],
    cancelled: [],
    errors: [],
  };

  // Only native, scheduled bookings that own a calendar event, from ~now onward.
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(
      'id, customer_id, booking_date, booking_time, booking_datetime, duration_hours, status, google_calendar_event_id, booking_source'
    )
    .eq('status', 'scheduled')
    .eq('booking_source', 'native')
    .not('google_calendar_event_id', 'is', null)
    .gte('booking_datetime', windowStart);

  if (error) throw new Error(`Failed to load bookings: ${error.message}`);

  const rows = (bookings || []) as BookingRow[];
  result.scanned = rows.length;

  // Back-to-back bookings share one google_calendar_event_id (one 4h event -> 2 rows).
  const groups = new Map<string, BookingRow[]>();
  for (const b of rows) {
    const list = groups.get(b.google_calendar_event_id) || [];
    list.push(b);
    groups.set(b.google_calendar_event_id, list);
  }
  result.eventGroups = groups.size;

  for (const [eventId, groupRows] of groups) {
    // Fetch the current state of the event.
    let event: calendar_v3.Schema$Event | null = null;
    try {
      event = await calendar.getEvent(eventId);
    } catch (e: unknown) {
      const err = e as { code?: number; response?: { status?: number }; message?: string };
      const code = err?.code ?? err?.response?.status;
      if (code === 404 || code === 410) {
        event = null; // event was deleted in Calendar
      } else {
        result.errors.push({ eventId, error: String(err?.message || e) });
        continue; // transient/unknown error — do NOT cancel on uncertainty
      }
    }

    const isCancelled = !event || event.status === 'cancelled';

    if (isCancelled) {
      for (const b of groupRows) {
        let creditRefunded = false;
        if (!dryRun) {
          await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', b.id);
          creditRefunded = await refundCredit(supabase, b.id);
        } else {
          // Report what the refund WOULD do without writing.
          const { data: usage } = await supabase
            .from('session_usage')
            .select('session_credit_id')
            .eq('booking_id', b.id)
            .maybeSingle();
          creditRefunded = !!usage;
        }
        result.cancelled.push({
          bookingId: b.id,
          eventId,
          reason: event ? 'event_cancelled' : 'event_deleted',
          creditRefunded,
        });
      }
      continue;
    }

    // Event still active — detect a move via its start time.
    const startStr = event!.start?.dateTime;
    if (!startStr) {
      // All-day or malformed start; not a normal booking event.
      result.errors.push({ eventId, error: 'event has no dateTime start (all-day?)' });
      continue;
    }
    const eventStart = new Date(startStr);

    // Assign slots in chronological order so back-to-back rows map predictably:
    // row[0] -> event start, row[1] -> event start + 2h.
    const ordered = [...groupRows].sort((a, b) => a.booking_time.localeCompare(b.booking_time));
    for (let i = 0; i < ordered.length; i++) {
      const b = ordered[i];
      const slotStart = new Date(eventStart.getTime() + i * SLOT_DURATION_HOURS * 3600 * 1000);
      const current = new Date(b.booking_datetime);

      if (Math.abs(slotStart.getTime() - current.getTime()) <= MATCH_TOLERANCE_MS) {
        result.unchanged++;
        continue;
      }

      const { date, time } = seattleLocalParts(slotStart);
      result.moved.push({
        bookingId: b.id,
        eventId,
        fromLocal: `${b.booking_date} ${b.booking_time}`,
        toLocal: `${date} ${time}`,
        from: b.booking_datetime,
        to: slotStart.toISOString(),
      });

      if (!dryRun) {
        await supabase
          .from('bookings')
          .update({
            booking_date: date,
            booking_time: time,
            booking_datetime: slotStart.toISOString(),
          })
          .eq('id', b.id);
      }
    }
  }

  return result;
}
