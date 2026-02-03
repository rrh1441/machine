import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  google_calendar_event_id: string | null;
  created_at: string;
  customers: { email: string; name: string | null } | null;
}

async function run() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, booking_date, booking_time, status, google_calendar_event_id, created_at, customers(email, name)')
    .eq('status', 'scheduled')
    .is('google_calendar_event_id', null)
    .order('booking_date') as { data: Booking[] | null; error: unknown };

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log('\n=== BOOKINGS MISSING CALENDAR EVENTS ===\n');
  console.log('Date       | Time  | Customer');
  console.log('------------------------------------------');

  data?.forEach(b => {
    const c = b.customers;
    console.log(b.booking_date + ' | ' + b.booking_time.slice(0, 5) + ' | ' + (c?.name || 'N/A') + ' <' + c?.email + '>');
  });

  console.log('\nTotal missing: ' + (data?.length || 0));
}

run();
