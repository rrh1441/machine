import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';
import { syncCalendarToDb } from '@/lib/booking/sync-calendar';

/**
 * GET /api/cron/sync-calendar
 *
 * Reconciles the `bookings` table to Google Calendar (Calendar is the source of
 * truth). Picks up moves/cancellations made directly in Calendar that bypass the
 * app's reschedule/cancel routes.
 *
 * Auth (production): EITHER
 *   - `Authorization: Bearer <CRON_SECRET>`  (Vercel cron), OR
 *   - `x-admin-secret: <ADMIN_DEBUG_SECRET>`  (manual trigger)
 *
 * Query:
 *   `?dryRun=1`          report what would change without writing
 *   `?lookbackHours=N`   how far back to reconcile (default 12; clamped 1..2880).
 *                        The scheduled cron always uses the default; a wider
 *                        window is only for manual backfills.
 */
function isAuthorized(req: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true;

  const authHeader = req.headers.get('authorization');
  const adminSecret = req.headers.get('x-admin-secret');

  const cronOk = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const adminOk = !!process.env.ADMIN_DEBUG_SECRET && adminSecret === process.env.ADMIN_DEBUG_SECRET;

  return cronOk || adminOk;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const calendar = createGoogleCalendarClient();
  if (!calendar) {
    return NextResponse.json({ error: 'Google Calendar not configured' }, { status: 503 });
  }

  const dryRunParam = req.nextUrl.searchParams.get('dryRun');
  const dryRun = dryRunParam === '1' || dryRunParam === 'true';

  const lookbackParam = req.nextUrl.searchParams.get('lookbackHours');
  const lookbackHours = lookbackParam
    ? Math.min(2880, Math.max(1, Number(lookbackParam) || 12))
    : undefined;

  try {
    const result = await syncCalendarToDb(supabaseAdmin, calendar, { dryRun, lookbackHours });
    if (result.moved.length || result.cancelled.length || result.errors.length) {
      console.log('Calendar sync applied changes:', JSON.stringify(result));
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error('Calendar sync failed:', err?.message || e);
    return NextResponse.json({ ok: false, error: String(err?.message || e) }, { status: 500 });
  }
}
