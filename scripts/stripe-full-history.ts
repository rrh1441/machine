import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia'
});

async function run() {
  // Go back 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  console.log('Searching charges from', twoYearsAgo.toLocaleDateString(), 'to now...\n');

  const charges: Stripe.Charge[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.charges.list({
      created: { gte: Math.floor(twoYearsAgo.getTime() / 1000) },
      limit: 100,
      starting_after: startingAfter,
    });

    charges.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Filter successful, non-refunded, non-subscription charges (ball machine only)
  const ballMachineCharges = charges.filter(c =>
    c.status === 'succeeded' &&
    c.refunded === false &&
    (c.description === null || c.description.includes('Subscription') === false)
  );

  console.log('Total charges found:', charges.length);
  console.log('Ball machine charges (non-subscription):', ballMachineCharges.length);

  // Group by email
  const byEmail = new Map<string, { name: string; charges: { date: string; amount: number }[]; total: number }>();

  ballMachineCharges.forEach(c => {
    const email = c.billing_details?.email || c.receipt_email || 'unknown';
    const name = c.billing_details?.name || '';

    if (!byEmail.has(email)) {
      byEmail.set(email, { name, charges: [], total: 0 });
    }

    const customer = byEmail.get(email)!;
    customer.charges.push({
      date: new Date(c.created * 1000).toLocaleDateString(),
      amount: c.amount / 100
    });
    customer.total += c.amount / 100;
  });

  console.log('\n=== ALL BALL MACHINE CUSTOMERS (sorted by date of first purchase) ===\n');

  // Sort by earliest charge date
  const sorted = Array.from(byEmail.entries())
    .map(([email, data]) => ({
      email,
      ...data,
      firstDate: new Date(data.charges[data.charges.length - 1].date)
    }))
    .sort((a, b) => a.firstDate.getTime() - b.firstDate.getTime());

  sorted.forEach(c => {
    const sessions = c.charges.reduce((sum, ch) => {
      if (ch.amount === 40) return sum + 1;
      if (ch.amount === 105) return sum + 3;
      if (ch.amount === 300) return sum + 10;
      return sum + 1; // unknown amount, assume 1
    }, 0);

    console.log(`${c.email} | ${c.name} | $${c.total} | ${sessions} sessions | First: ${c.charges[c.charges.length-1].date}`);
  });
}

run().catch(e => console.error('Error:', e.message));
