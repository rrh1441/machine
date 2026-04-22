// Stripe purchases (from current account - Aug 2025+)
const stripePurchases: Record<string, { paid: number; sessions: number }> = {
  'abbygold724@gmail.com': { paid: 145, sessions: 4 },  // $40 + $105
  'williamsnedegar@gmail.com': { paid: 120, sessions: 3 },  // 3x $40
  'yash33465@gmail.com': { paid: 105, sessions: 3 },  // $105
  'lindseyanntoth@gmail.com': { paid: 80, sessions: 2 },  // 2x $40
  'sergio.epost@gmail.com': { paid: 80, sessions: 2 },  // 2x $40
  'sapnavibhaker@gmail.com': { paid: 40, sessions: 1 },
  'ihavetherice@gmail.com': { paid: 40, sessions: 1 },
  'curtis.siemens@hotmail.com': { paid: 40, sessions: 1 },
  'andrew.recato@gmail.com': { paid: 40, sessions: 1 },
  'tienle910@yahoo.com': { paid: 40, sessions: 1 },
  'swanbergee@gmail.com': { paid: 40, sessions: 1 },
  'michelle.s.fine@gmail.com': { paid: 40, sessions: 1 },
  'brit.morse@gmail.com': { paid: 40, sessions: 1 },
  'shreyaskor6@icloud.com': { paid: 40, sessions: 1 },
  'vijayendra.roy@gmail.com': { paid: 40, sessions: 1 },
  'sampsocm@gmail.com': { paid: 116, sessions: 1 },
};

// Calendly appearances - we only have "last meeting date", not total count
// So this is minimum 1 appearance per person
const calendlyAppearances: Record<string, number> = {
  'ryanrheger@gmail.com': 1,
  'shreyaskar6@gmail.com': 1,
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
};

console.log('=== CURRENT STRIPE CUSTOMERS ===\n');

console.log('CONFIRMED USED ALL (bought 1, used 1):');
const usedAll: string[] = [];
Object.entries(stripePurchases).forEach(([email, data]) => {
  const used = calendlyAppearances[email] || 0;
  if (data.sessions === 1 && used >= 1) {
    console.log('  ✓', email);
    usedAll.push(email);
  }
});

console.log('\nSTILL HAVE CREDITS (bought multi-pack):');
Object.entries(stripePurchases).forEach(([email, data]) => {
  const used = calendlyAppearances[email] || 0;
  if (data.sessions > 1) {
    console.log('  ✗', email, '- bought', data.sessions, ', appeared', used, 'time(s) in Calendly');
  }
});

console.log('\n=== SUMMARY ===');
console.log('\nSafe to email (confirmed used all ' + usedAll.length + '):');
usedAll.forEach(e => console.log('  ' + e));
