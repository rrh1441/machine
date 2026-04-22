import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface Customer {
  id: string;
  email: string;
  name: string | null;
}

interface Purchase {
  id: string;
  customer_id: string;
  package_type: string;
  sessions_purchased: number;
  amount_paid: number;
  created_at: string;
  customers: Customer;
}

interface Booking {
  id: string;
  customer_id: string;
  booking_datetime: string;
  status: string;
  booking_source: string;
  customers: Customer;
}

interface SessionCredit {
  id: string;
  customer_id: string;
  sessions_remaining: number;
  sessions_total: number;
}

interface CustomerSummary {
  email: string;
  name: string | null;
  totalPurchased: number;
  totalSpent: number;
  totalBooked: number;
  totalCompleted: number;
  totalCancelled: number;
  sessionsRemaining: number;
  unusedSessions: number;
  purchases: { date: string; package: string; sessions: number; amount: number }[];
  bookings: { date: string; status: string; source: string }[];
}

async function run() {
  const now = new Date();
  const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const lastYearStr = lastYear.toISOString();

  console.log('\n=== PURCHASE VS USAGE COMPARISON ===');
  console.log(`Period: ${lastYear.toLocaleDateString()} to ${now.toLocaleDateString()}\n`);

  // Get all purchases from last year
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('*, customers(id, email, name)')
    .gte('created_at', lastYearStr)
    .order('created_at', { ascending: false }) as { data: Purchase[] | null; error: unknown };

  if (purchasesError) {
    console.error('Error fetching purchases:', purchasesError);
    process.exit(1);
  }

  // Get all bookings from last year
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*, customers(id, email, name)')
    .gte('booking_datetime', lastYearStr)
    .order('booking_datetime', { ascending: false }) as { data: Booking[] | null; error: unknown };

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    process.exit(1);
  }

  // Get current session credits
  const { data: credits, error: creditsError } = await supabase
    .from('session_credits')
    .select('*, customers(id, email, name)') as { data: (SessionCredit & { customers: Customer })[] | null; error: unknown };

  if (creditsError) {
    console.error('Error fetching credits:', creditsError);
    process.exit(1);
  }

  // Build customer summaries
  const customerMap = new Map<string, CustomerSummary>();

  // Process purchases
  purchases?.forEach(p => {
    const email = p.customers?.email;
    if (!email) return;

    if (!customerMap.has(email)) {
      customerMap.set(email, {
        email,
        name: p.customers?.name || null,
        totalPurchased: 0,
        totalSpent: 0,
        totalBooked: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        sessionsRemaining: 0,
        unusedSessions: 0,
        purchases: [],
        bookings: []
      });
    }

    const customer = customerMap.get(email)!;
    customer.totalPurchased += p.sessions_purchased;
    customer.totalSpent += p.amount_paid / 100; // Convert cents to dollars
    customer.purchases.push({
      date: new Date(p.created_at).toLocaleDateString(),
      package: p.package_type,
      sessions: p.sessions_purchased,
      amount: p.amount_paid / 100
    });
  });

  // Process bookings
  bookings?.forEach(b => {
    const email = b.customers?.email;
    if (!email) return;

    if (!customerMap.has(email)) {
      customerMap.set(email, {
        email,
        name: b.customers?.name || null,
        totalPurchased: 0,
        totalSpent: 0,
        totalBooked: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        sessionsRemaining: 0,
        unusedSessions: 0,
        purchases: [],
        bookings: []
      });
    }

    const customer = customerMap.get(email)!;
    customer.totalBooked++;
    if (b.status === 'completed' || b.status === 'scheduled') {
      customer.totalCompleted++;
    } else if (b.status === 'cancelled') {
      customer.totalCancelled++;
    }
    customer.bookings.push({
      date: new Date(b.booking_datetime).toLocaleDateString(),
      status: b.status,
      source: b.booking_source || 'unknown'
    });
  });

  // Add remaining credits
  credits?.forEach(c => {
    const email = c.customers?.email;
    if (!email || !customerMap.has(email)) return;

    const customer = customerMap.get(email)!;
    customer.sessionsRemaining += c.sessions_remaining;
  });

  // Calculate unused sessions
  customerMap.forEach(customer => {
    customer.unusedSessions = customer.totalPurchased - customer.totalCompleted;
  });

  // Sort by unused sessions (highest first)
  const sortedCustomers = Array.from(customerMap.values())
    .filter(c => c.totalPurchased > 0)
    .sort((a, b) => b.unusedSessions - a.unusedSessions);

  // Print summary
  console.log('=== CUSTOMERS WITH UNUSED SESSIONS ===\n');
  console.log('Email                                  | Purchased | Used | Remaining | Unused | Spent');
  console.log('--------------------------------------------------------------------------------------');

  sortedCustomers.forEach(c => {
    if (c.unusedSessions > 0) {
      console.log(
        `${c.email.padEnd(38)} | ${String(c.totalPurchased).padStart(9)} | ${String(c.totalCompleted).padStart(4)} | ${String(c.sessionsRemaining).padStart(9)} | ${String(c.unusedSessions).padStart(6)} | $${c.totalSpent.toFixed(2)}`
      );
    }
  });

  // Customers who purchased but never booked
  console.log('\n=== CUSTOMERS WHO PURCHASED BUT NEVER BOOKED ===\n');
  const neverBooked = sortedCustomers.filter(c => c.totalBooked === 0);
  if (neverBooked.length === 0) {
    console.log('None - all customers who purchased have booked at least once.');
  } else {
    neverBooked.forEach(c => {
      console.log(`${c.email} - Purchased: ${c.totalPurchased} sessions ($${c.totalSpent.toFixed(2)})`);
      c.purchases.forEach(p => {
        console.log(`  - ${p.date}: ${p.package} (${p.sessions} sessions, $${p.amount.toFixed(2)})`);
      });
    });
  }

  // Overall stats
  console.log('\n=== OVERALL STATISTICS ===\n');
  const totals = sortedCustomers.reduce((acc, c) => ({
    customers: acc.customers + 1,
    purchased: acc.purchased + c.totalPurchased,
    used: acc.used + c.totalCompleted,
    remaining: acc.remaining + c.sessionsRemaining,
    revenue: acc.revenue + c.totalSpent
  }), { customers: 0, purchased: 0, used: 0, remaining: 0, revenue: 0 });

  console.log(`Total Customers: ${totals.customers}`);
  console.log(`Total Sessions Purchased: ${totals.purchased}`);
  console.log(`Total Sessions Used: ${totals.used}`);
  console.log(`Total Sessions Remaining: ${totals.remaining}`);
  console.log(`Utilization Rate: ${((totals.used / totals.purchased) * 100).toFixed(1)}%`);
  console.log(`Total Revenue: $${totals.revenue.toFixed(2)}`);

  // Detailed per-customer breakdown (JSON output for further analysis)
  console.log('\n=== DETAILED DATA (JSON) ===\n');
  console.log(JSON.stringify(sortedCustomers, null, 2));
}

run();
