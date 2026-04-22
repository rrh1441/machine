import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia'
});

async function run() {
  const now = new Date();
  const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  console.log('\n=== ALL STRIPE CHARGES (Last Year) ===');
  console.log(`Period: ${lastYear.toLocaleDateString()} to ${now.toLocaleDateString()}\n`);

  // Get all successful charges from the past year
  const charges: Stripe.Charge[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.charges.list({
      created: { gte: Math.floor(lastYear.getTime() / 1000) },
      limit: 100,
      starting_after: startingAfter,
    });

    charges.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Filter to successful charges only
  const successfulCharges = charges.filter(c => c.status === 'succeeded' && !c.refunded);

  console.log(`Total successful charges: ${successfulCharges.length}\n`);

  // Group by customer email
  const customerCharges = new Map<string, {
    name: string | null;
    email: string;
    charges: { date: string; amount: number; description: string | null }[];
    total: number;
  }>();

  for (const charge of successfulCharges) {
    const email = charge.billing_details?.email || charge.receipt_email || 'unknown';
    const name = charge.billing_details?.name || null;

    if (!customerCharges.has(email)) {
      customerCharges.set(email, {
        name,
        email,
        charges: [],
        total: 0
      });
    }

    const customer = customerCharges.get(email)!;
    customer.charges.push({
      date: new Date(charge.created * 1000).toLocaleDateString(),
      amount: charge.amount / 100,
      description: charge.description
    });
    customer.total += charge.amount / 100;
  }

  // Sort by total spent
  const sortedCustomers = Array.from(customerCharges.values())
    .sort((a, b) => b.total - a.total);

  console.log('=== ALL STRIPE CUSTOMERS ===\n');
  console.log('Email                                  | Name                    | Total   | # Charges');
  console.log('----------------------------------------------------------------------------------------');

  let grandTotal = 0;
  sortedCustomers.forEach(c => {
    console.log(
      `${c.email.padEnd(38)} | ${(c.name || 'N/A').padEnd(23)} | $${c.total.toFixed(2).padStart(6)} | ${c.charges.length}`
    );
    grandTotal += c.total;
  });

  console.log('----------------------------------------------------------------------------------------');
  console.log(`TOTAL: $${grandTotal.toFixed(2)}`);

  // Detailed breakdown
  console.log('\n\n=== DETAILED CHARGE HISTORY ===\n');
  sortedCustomers.forEach(c => {
    console.log(`\n${c.name || 'Unknown'} (${c.email}) - Total: $${c.total.toFixed(2)}`);
    c.charges.forEach(ch => {
      console.log(`  ${ch.date}: $${ch.amount.toFixed(2)} - ${ch.description || 'No description'}`);
    });
  });
}

run().catch(console.error);
