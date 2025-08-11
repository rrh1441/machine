# Next Steps - Full Automation Implementation

## Current Status
- ✅ Database schema created in Supabase
- ✅ Environment variables ready (Stripe, Calendly, Resend)
- ✅ UI updated with SwingStick add-on
- ❌ API routes not created
- ❌ Webhook handlers not implemented
- ❌ Email automation not set up
- ❌ Customer portal not built

## Step 1: Install Dependencies

```bash
npm install stripe @supabase/supabase-js resend axios
npm install --save-dev @types/node
```

## Step 2: Create Environment File

Create `.env.local` with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_SINGLE=price_xxx
STRIPE_PRICE_3PACK=price_xxx
STRIPE_PRICE_10PACK=price_xxx
STRIPE_PRODUCT_SWINGSTICK=prod_SqfKhYmsP8JyAv
STRIPE_PRICE_SWINGSTICK=price_1Ruy05KSaqiJUYkjIfOslVQW

# Calendly
CALENDLY_API_TOKEN=your_personal_access_token
CALENDLY_WEBHOOK_SIGNING_KEY=your_webhook_signing_key
CALENDLY_ORGANIZATION_URI=https://api.calendly.com/organizations/YOUR_ORG_ID

# Resend
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_URL=https://www.seattleballmachine.com
```

## Step 3: Create Core Library Files

### Create `/lib/supabase/server.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### Create `/lib/stripe/client.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})
```

### Create `/lib/resend/client.ts`

```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

## Step 4: Create API Routes

### Create `/app/api/checkout/create-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

const PRICE_MAP = {
  'single': process.env.STRIPE_PRICE_SINGLE!,
  '3_pack': process.env.STRIPE_PRICE_3PACK!,
  '10_pack': process.env.STRIPE_PRICE_10PACK!,
}

const SESSION_COUNT = {
  'single': 1,
  '3_pack': 3,
  '10_pack': 10,
}

export async function POST(req: NextRequest) {
  try {
    const { packageType, customerEmail } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: PRICE_MAP[packageType as keyof typeof PRICE_MAP],
          quantity: 1,
        }
      ],
      metadata: {
        package_type: packageType,
        sessions_count: SESSION_COUNT[packageType as keyof typeof SESSION_COUNT].toString()
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/rentalbooking?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
      // Add SwingStick as recommended product
      payment_intent_data: {
        metadata: {
          package_type: packageType,
        }
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### Create `/app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Create or update customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert({
        email: session.customer_email,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
        stripe_customer_id: session.customer,
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (customerError) {
      console.error('Customer creation error:', customerError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Record purchase
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        customer_id: customer.id,
        stripe_payment_intent_id: session.payment_intent,
        stripe_checkout_session_id: session.id,
        package_type: session.metadata?.package_type || 'single',
        sessions_purchased: parseInt(session.metadata?.sessions_count || '1'),
        amount_paid: session.amount_total,
        includes_swingstick: false, // TODO: Check line items for SwingStick
        swingstick_quantity: 0,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Add session credits
    const { error: creditError } = await supabaseAdmin
      .from('session_credits')
      .insert({
        customer_id: customer.id,
        purchase_id: purchase.id,
        sessions_remaining: parseInt(session.metadata?.sessions_count || '1'),
        sessions_total: parseInt(session.metadata?.sessions_count || '1'),
      })

    if (creditError) {
      console.error('Credit creation error:', creditError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
      to: session.customer_email!,
      subject: 'Your Seattle Ball Machine Rental is Confirmed!',
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>You've purchased ${session.metadata?.sessions_count} session(s).</p>
        <p><a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking">Click here to schedule your first session</a></p>
        <h2>Pickup Location</h2>
        <p>2116 4th Avenue West<br>Seattle, WA 98119</p>
        <p>Questions? Reply to this email or call (253) 252-9577</p>
      `
    })
  }

  return NextResponse.json({ received: true })
}
```

### Create `/app/api/webhooks/calendly/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('calendly-webhook-signature')!
  
  // Verify webhook signature
  const hmac = crypto.createHmac('sha256', process.env.CALENDLY_WEBHOOK_SIGNING_KEY!)
  hmac.update(body)
  const expectedSignature = hmac.digest('base64')
  
  if (signature !== `v1=${expectedSignature}`) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  // Store webhook event
  await supabaseAdmin
    .from('calendly_webhooks')
    .insert({
      event_id: event.event,
      event_type: event.event,
      payload: event,
    })

  if (event.event === 'invitee.created') {
    const invitee = event.payload
    const email = invitee.email

    // Find customer
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (!customer) {
      console.error('Customer not found:', email)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check available sessions
    const { data: credits } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)

    const totalSessions = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0

    if (totalSessions === 0) {
      // Send warning email
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: email,
        subject: 'No Sessions Available - Booking at Risk',
        html: `
          <h1>Warning: No Sessions Available</h1>
          <p>You've booked a session but have no credits remaining.</p>
          <p>Please purchase additional sessions to avoid cancellation.</p>
        `
      })
      return NextResponse.json({ error: 'No sessions available' }, { status: 400 })
    }

    // Create booking
    const bookingDate = new Date(invitee.event.start_time)
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id: customer.id,
        calendly_event_id: invitee.event.uuid,
        calendly_invitee_id: invitee.uuid,
        booking_date: bookingDate.toISOString().split('T')[0],
        booking_time: bookingDate.toTimeString().split(' ')[0],
        booking_datetime: bookingDate.toISOString(),
        calendly_cancel_url: invitee.cancel_url,
        calendly_reschedule_url: invitee.reschedule_url,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Deduct session
    const { data: oldestCredit } = await supabaseAdmin
      .from('session_credits')
      .select('id, sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (oldestCredit) {
      await supabaseAdmin
        .from('session_credits')
        .update({ sessions_remaining: oldestCredit.sessions_remaining - 1 })
        .eq('id', oldestCredit.id)

      await supabaseAdmin
        .from('session_usage')
        .insert({
          booking_id: booking.id,
          session_credit_id: oldestCredit.id,
          sessions_used: 1,
        })
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
      to: email,
      subject: 'Booking Confirmed - Seattle Ball Machine',
      html: `
        <h1>Your booking is confirmed!</h1>
        <p>Date: ${bookingDate.toLocaleDateString()}</p>
        <p>Time: ${bookingDate.toLocaleTimeString()}</p>
        <p>Sessions remaining: ${totalSessions - 1}</p>
        <h2>Pickup Location</h2>
        <p>2116 4th Avenue West<br>Seattle, WA 98119</p>
        <p>Need to change your booking? <a href="${invitee.reschedule_url}">Reschedule</a> or <a href="${invitee.cancel_url}">Cancel</a></p>
      `
    })
  }

  if (event.event === 'invitee.canceled') {
    const invitee = event.payload

    // Find and cancel booking
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('calendly_invitee_id', invitee.uuid)
      .select()
      .single()

    if (booking) {
      // Refund session
      const { data: usage } = await supabaseAdmin
        .from('session_usage')
        .select('session_credit_id')
        .eq('booking_id', booking.id)
        .single()

      if (usage) {
        await supabaseAdmin
          .from('session_credits')
          .update({ 
            sessions_remaining: supabaseAdmin.raw('sessions_remaining + 1')
          })
          .eq('id', usage.session_credit_id)
      }

      // Send cancellation email
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: invitee.email,
        subject: 'Booking Cancelled - Seattle Ball Machine',
        html: `
          <h1>Your booking has been cancelled</h1>
          <p>Your session credit has been restored.</p>
          <p>Ready to book again? <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking">Schedule a new session</a></p>
        `
      })
    }
  }

  return NextResponse.json({ received: true })
}
```

## Step 5: Update Main Page for Dynamic Checkout

### Update `/app/page.tsx` pricing cards:

Replace the static Stripe links with dynamic checkout:

```typescript
// Add to imports
'use client'
import { useState } from 'react'

// Add checkout function
const handleCheckout = async (packageType: string) => {
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageType })
    })
    
    const { sessionId } = await response.json()
    
    // Redirect to Stripe
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    await stripe.redirectToCheckout({ sessionId })
  } catch (error) {
    console.error('Checkout error:', error)
  }
}

// Replace <a> tags with:
<button
  onClick={() => handleCheckout('single')}
  className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
>
  Book&nbsp;Single&nbsp;Session
</button>
```

## Step 6: Configure Webhooks

### Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://www.seattleballmachine.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Calendly Webhook
1. Go to Calendly → Integrations → Webhooks
2. Add webhook URL: `https://www.seattleballmachine.com/api/webhooks/calendly`
3. Subscribe to events: `invitee.created`, `invitee.canceled`
4. Copy signing key to `CALENDLY_WEBHOOK_SIGNING_KEY`

## Step 7: Create Cron Job for Reminders

### Create `/app/api/cron/send-reminders/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'

export async function GET() {
  // Get bookings for tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('*, customers(*)')
    .eq('booking_date', tomorrow.toISOString().split('T')[0])
    .eq('status', 'scheduled')

  for (const booking of bookings || []) {
    await resend.emails.send({
      from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
      to: booking.customers.email,
      subject: 'Reminder: Your ball machine rental is tomorrow!',
      html: `
        <h1>See you tomorrow!</h1>
        <p>Your rental is scheduled for ${booking.booking_time}</p>
        <p>Pickup: 2116 4th Avenue West, Seattle, WA 98119</p>
      `
    })

    await supabaseAdmin
      .from('email_logs')
      .insert({
        customer_id: booking.customer_id,
        booking_id: booking.id,
        email_type: 'booking_reminder',
        sent_to: booking.customers.email,
        subject: 'Reminder: Your ball machine rental is tomorrow!',
        status: 'sent',
        sent_at: new Date().toISOString()
      })
  }

  return NextResponse.json({ sent: bookings?.length || 0 })
}
```

### Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 10 * * *"
  }]
}
```

## Step 8: Create Customer Portal

### Create `/app/account/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AccountPage() {
  const [customer, setCustomer] = useState<any>(null)
  const [sessions, setSessions] = useState(0)
  const [bookings, setBookings] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get customer data from email in URL params
    const email = new URLSearchParams(window.location.search).get('email')
    if (email) {
      loadCustomerData(email)
    }
  }, [])

  const loadCustomerData = async (email: string) => {
    const { data: customer } = await supabase
      .from('customers')
      .select('*, session_credits(*), bookings(*)')
      .eq('email', email)
      .single()

    if (customer) {
      setCustomer(customer)
      const totalSessions = customer.session_credits.reduce(
        (sum: number, credit: any) => sum + credit.sessions_remaining, 0
      )
      setSessions(totalSessions)
      setBookings(customer.bookings)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Session Credits</h2>
          <p className="text-3xl font-bold">{sessions}</p>
          <p className="text-gray-600">sessions remaining</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          {bookings.filter(b => b.status === 'scheduled').map(booking => (
            <div key={booking.id} className="mb-2">
              <p>{new Date(booking.booking_datetime).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">{booking.booking_time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Step 9: Test Everything

1. **Test Purchase Flow**:
   - Buy a package
   - Check database for customer, purchase, and credits
   - Verify confirmation email

2. **Test Booking Flow**:
   - Book via Calendly
   - Check database for booking and session deduction
   - Verify booking confirmation email

3. **Test Cancellation**:
   - Cancel a booking
   - Check session credit restored
   - Verify cancellation email

4. **Test Reminders**:
   - Trigger cron job manually
   - Verify reminder emails sent

## Step 10: Deploy

```bash
git add .
git commit -m "Add full automation system"
git push
```

## Monitoring

1. Set up Stripe webhook logs monitoring
2. Monitor Supabase logs for errors
3. Check Resend dashboard for email delivery
4. Set up alerts for failed webhooks

## Manual Override Options

Create an admin page at `/admin` to:
- Manually add/remove sessions
- Create bookings without Calendly
- Send custom emails
- View all customers and their status

This completes the full automation setup!