import * as fs from 'fs';

// Ball machine payments from unified_payments.csv (manually extracted from grep)
const payments = [
  { email: 'williamsnedegar@gmail.com', amount: 40, date: '2025-08-09' },
  { email: 'ryanalli796@gmail.com', amount: 40, date: '2025-08-09' },
  { email: 'amnesiakdotcom@gmail.com', amount: 105, date: '2025-08-08' },  // 3-pack
  { email: 'swanbergee@gmail.com', amount: 40, date: '2025-08-08' },
  { email: 'williamsnedegar@gmail.com', amount: 40, date: '2025-07-31' },
  { email: 'mehereshy@gmail.com', amount: 40, date: '2025-07-20' },
  { email: 'sindhuja.dutta@gmail.com', amount: 40, date: '2025-07-19' },
  { email: 'morutkin@gmail.com', amount: 105, date: '2025-07-17' },  // 3-pack
  { email: 'markakarle@gmail.com', amount: 40, date: '2025-07-12' },
  { email: 'natalie.ethell@gmail.com', amount: 40, date: '2025-07-08' },
  { email: 'leobentivoglio@gmail.com', amount: 40, date: '2025-06-30' },
  { email: 'gracecho678@gmail.com', amount: 105, date: '2025-06-29' },  // 3-pack
  { email: 'jennyhayo@yahoo.com', amount: 40, date: '2025-06-28' },
  { email: 'cbwakefield78@gmail.com', amount: 40, date: '2025-06-22' },
  { email: 'ywangbc@gmail.com', amount: 40, date: '2025-06-14' },
  { email: 'rjayilagan@me.com', amount: 40, date: '2025-06-14' },
  { email: 'ddebruyne@outlook.com', amount: 105, date: '2025-06-12' },  // 3-pack
  { email: 'sanniacharya@gmail.com', amount: 40, date: '2025-06-07' },
  { email: 'lindseyanntoth@gmail.com', amount: 40, date: '2025-06-05' },
  { email: 'josh.krisher@gmail.com', amount: 40, date: '2025-06-02' },
  { email: 'hzq5477@gmail.com', amount: 40, date: '2025-05-29' },
  { email: 'rayramonc@yahoo.com', amount: 40, date: '2025-05-23' },
  { email: 'sims1027@gmail.com', amount: 40, date: '2025-05-09' },
  { email: 'markyguan@gmail.com', amount: 40, date: '2025-05-08' },
  { email: 'brandon.biggs@outlook.com', amount: 40, date: '2025-05-02' },
  { email: 'yangyuxue2333@gmail.com', amount: 105, date: '2025-04-26' },  // 3-pack
  { email: 'mulugetaliya1@gmail.com', amount: 300, date: '2025-04-18' },  // 10-pack
  { email: 'kendrick.kronthal@gmail.com', amount: 40, date: '2024-11-01' },  // from Calendly description
  { email: 'schemas_pyloric_0b@icloud.com', amount: 40, date: '2024-10-31' },  // Skylar Lee
  { email: 'krwalter0@gmail.com', amount: 40, date: '2024-10-13' },  // Kurt Walter
  { email: 'jessica.mann.heger@gmail.com', amount: 40, date: '2024-09-16' },  // Jessi Heger
  // New Stripe account purchases (Aug 2025+)
  { email: 'brit.morse@gmail.com', amount: 40, date: '2025-08-12' },
  { email: 'michelle.s.fine@gmail.com', amount: 40, date: '2025-08-21' },
  { email: 'williamsnedegar@gmail.com', amount: 40, date: '2025-08-28' },
  { email: 'abbygold724@gmail.com', amount: 40, date: '2025-09-05' },
  { email: 'abbygold724@gmail.com', amount: 105, date: '2025-09-16' },
  { email: 'yash33465@gmail.com', amount: 105, date: '2025-09-05' },
  { email: 'tienle910@yahoo.com', amount: 40, date: '2025-09-16' },
  { email: 'andrew.recato@gmail.com', amount: 40, date: '2025-09-21' },
  { email: 'curtis.siemens@hotmail.com', amount: 40, date: '2025-09-26' },
  { email: 'lindseyanntoth@gmail.com', amount: 40, date: '2025-10-05' },
  { email: 'ihavetherice@gmail.com', amount: 40, date: '2025-11-20' },
  { email: 'sapnavibhaker@gmail.com', amount: 40, date: '2025-12-02' },
  { email: 'shreyaskor6@icloud.com', amount: 40, date: '2025-12-13' },
  { email: 'vijayendra.roy@gmail.com', amount: 40, date: '2026-03-20' },
  { email: 'sergio.epost@gmail.com', amount: 40, date: '2026-04-08' },
  { email: 'sergio.epost@gmail.com', amount: 40, date: '2026-04-08' },
  { email: 'sampsocm@gmail.com', amount: 116, date: '2026-04-20' },
];

// Calendly appearances (from user's list)
const calendlyAppearances: Record<string, number> = {
  'ryanrheger@gmail.com': 1,
  'shreyaskar6@gmail.com': 1,  // same as shreyaskor6@icloud.com
  'sapnavibhaker@gmail.com': 1,
  'ihavetherice@gmail.com': 1,
  'amaolll123@gmail.com': 1,
  'curtis.siemens@hotmail.com': 1,
  'andrew.recato@gmail.com': 1,
  'amnesiak@outlook.com': 1,
  'tienle910@yahoo.com': 1,
  'abbygold724@gmail.com': 1,
  'yash33465@gmail.com': 1,
  'michelle.s.fine@gmail.com': 1,
  'brit.morse@gmail.com': 1,
  'ryanalli796@gmail.com': 1,
  'amnesiakdotcom@gmail.com': 1,
  'swanbergee@gmail.com': 1,
  'williamsnedegar@gmail.com': 1,
  'annaylee93@gmail.com': 1,
  'mehereshy@gmail.com': 1,
  'sindhuja.dutta@gmail.com': 1,
  'morutkin@gmail.com': 1,
  'markakarle@gmail.com': 1,
  'gracecho678@gmail.com': 1,
  'natalie.ethell@gmail.com': 1,
  'rjayilagan@me.com': 1,
  'leobentivoglio@gmail.com': 1,
  'jennyhayo@gmail.com': 1,
  'ddebruyne@outlook.com': 1,
  'cbwakefield78@gmail.com': 1,
  'ywangbc@gmail.com': 1,
  'josh.krisher@gmail.com': 1,
  'rrh1441@gmail.com': 1,
  'sanniacharya@gmail.com': 1,
  'lindseyanntoth@gmail.com': 1,
  'yingzhaochicago@gmail.com': 1,
  'rayramonc@yahoo.com': 1,
  'sims1027@gmail.com': 1,
  'brandon.biggs@outlook.com': 1,
  'yangyuxue2333@gmail.com': 1,
  'eric@helloericyu.com': 1,
  'kendrick.kronthal@gmail.com': 1,
  'schemas_pyloric_0b@icloud.com': 1,
  'krwalter0@gmail.com': 1,
  'vijayendra.roy@gmail.com': 1,
  'sampsocm@gmail.com': 1,
  'sergio.epost@gmail.com': 1,
  'shreyaskor6@icloud.com': 1,
};

// Calculate sessions from amount
function sessionsFromAmount(amount: number): number {
  if (amount === 40) return 1;
  if (amount === 105) return 3;
  if (amount === 300) return 10;
  return 1;  // unknown, assume 1
}

// Group by email
const byEmail = new Map<string, { sessions: number; amounts: number[] }>();

payments.forEach(p => {
  const email = p.email.toLowerCase();
  if (!byEmail.has(email)) {
    byEmail.set(email, { sessions: 0, amounts: [] });
  }
  const data = byEmail.get(email)!;
  data.sessions += sessionsFromAmount(p.amount);
  data.amounts.push(p.amount);
});

// Handle email aliases
const aliases: Record<string, string> = {
  'shreyaskar6@gmail.com': 'shreyaskor6@icloud.com',
  'jennyhayo@yahoo.com': 'jennyhayo@gmail.com',
};

console.log('=== FULL COMPARISON: STRIPE PURCHASES vs CALENDLY USAGE ===\n');

console.log('USED ALL CREDITS (sessions bought = sessions used):');
const usedAll: string[] = [];

byEmail.forEach((data, email) => {
  // Check Calendly under this email or alias
  let used = calendlyAppearances[email] || 0;
  Object.entries(aliases).forEach(([alias, canonical]) => {
    if (email === canonical && calendlyAppearances[alias]) {
      used += calendlyAppearances[alias];
    }
  });

  if (data.sessions === 1 && used >= 1) {
    console.log(`  ✓ ${email} (bought 1, used 1)`);
    usedAll.push(email);
  }
});

console.log('\nSTILL HAVE CREDITS (bought more than used):');
byEmail.forEach((data, email) => {
  let used = calendlyAppearances[email] || 0;
  Object.entries(aliases).forEach(([alias, canonical]) => {
    if (email === canonical && calendlyAppearances[alias]) {
      used += calendlyAppearances[alias];
    }
  });

  if (data.sessions > 1) {
    const remaining = data.sessions - used;
    console.log(`  ✗ ${email} - bought ${data.sessions}, used ${used}, remaining: ${remaining}`);
  }
});

console.log('\n=== SAFE TO EMAIL (used all credits): ' + usedAll.length + ' people ===\n');
usedAll.forEach(e => console.log(e));
