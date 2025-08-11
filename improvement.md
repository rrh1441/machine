# Seattle Ball Machine Rental - Comprehensive Improvement Plan

## Executive Summary

This improvement plan transforms the current simple checkout-link system into a comprehensive rental management platform with:
- Full session tracking and credit management
- Automated booking and reminder emails
- Stripe API integration with conditional products (SwingStick)
- Calendly webhook integration for automatic session deduction
- Admin dashboard for manual session management
- Customer portal for viewing remaining sessions

## Current State Analysis

### Existing Infrastructure
- **Frontend**: Next.js 15.2.4 with TypeScript
- **Database**: Supabase (currently only tracking referral sources)
- **Payments**: Stripe checkout links (no API integration)
- **Scheduling**: Calendly embed (no webhook integration)
- **Analytics**: Vercel Analytics
- **Email**: None (relying on Stripe/Calendly emails)

### Current Flow
1. Customer clicks Stripe checkout link
2. After payment, redirected to `/rentalbooking`
3. Customer books via Calendly embed
4. No session tracking or credit management

## Proposed Architecture

### Tech Stack
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe API with webhooks
- **Scheduling**: Calendly API with webhooks
- **Email**: Resend or SendGrid
- **Authentication**: Supabase Auth
- **Admin**: Custom Next.js dashboard

## Database Schema

```sql
-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table (tracks what customers bought)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  package_type TEXT NOT NULL, -- 'single', '3_pack', '10_pack'
  sessions_purchased INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL, -- in cents
  includes_swingstick BOOLEAN DEFAULT FALSE,
  swingstick_quantity INTEGER DEFAULT 0,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session credits table (tracks available sessions)
CREATE TABLE session_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  purchase_id UUID REFERENCES purchases(id),
  sessions_remaining INTEGER NOT NULL,
  sessions_total INTEGER NOT NULL,
  expires_at TIMESTAMPTZ, -- optional expiration
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table (tracks actual rentals)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  calendly_event_id TEXT UNIQUE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_hours INTEGER DEFAULT 2,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  includes_swingstick BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session usage table (links bookings to credits)
CREATE TABLE session_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  session_credit_id UUID REFERENCES session_credits(id),
  sessions_used INTEGER DEFAULT 1,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manual adjustments table (for admin overrides)
CREATE TABLE manual_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  adjustment_type TEXT NOT NULL, -- 'add_session', 'remove_session', 'extend_expiry'
  sessions_adjusted INTEGER,
  reason TEXT NOT NULL,
  adjusted_by TEXT NOT NULL, -- admin email/id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  email_type TEXT NOT NULL, -- 'purchase_confirmation', 'booking_confirmation', 'reminder', 'low_credits'
  sent_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_session_credits_customer ON session_credits(customer_id);
```

## Implementation Phases

### Phase 1: Database & Core Infrastructure (Week 1)

1. **Set up Supabase tables**
   - Run migration scripts
   - Set up Row Level Security (RLS) policies
   - Create database functions for credit management

2. **Environment configuration**
   ```env
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   STRIPE_PRICE_SINGLE=
   STRIPE_PRICE_3PACK=
   STRIPE_PRICE_10PACK=
   STRIPE_PRICE_SWINGSTICK=
   
   CALENDLY_WEBHOOK_SECRET=
   CALENDLY_API_TOKEN=
   
   RESEND_API_KEY=
   ```

### Phase 2: Stripe API Integration (Week 1-2)

1. **Install dependencies**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Create API routes**
   - `/api/checkout/create-session` - Dynamic checkout with SwingStick
   - `/api/webhooks/stripe` - Handle payment events
   - `/api/customers/[id]/credits` - Check remaining credits

3. **Checkout flow with SwingStick**
   ```typescript
   // /api/checkout/create-session.ts
   const session = await stripe.checkout.sessions.create({
     customer_email: email,
     line_items: [
       {
         price: getPriceId(packageType),
         quantity: 1,
       }
     ],
     // Optional SwingStick add-on
     optional_items: swingstickEnabled ? [
       {
         price: process.env.STRIPE_PRICE_SWINGSTICK,
         quantity: 1,
         adjustable_quantity: {
           enabled: true,
           minimum: 1,
           maximum: 10
         }
       }
     ] : [],
     metadata: {
       package_type: packageType,
       sessions_count: getSessionCount(packageType)
     },
     success_url: `${process.env.NEXT_PUBLIC_URL}/rentalbooking?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
   });
   ```

4. **Webhook handler**
   ```typescript
   // /api/webhooks/stripe.ts
   // Handle checkout.session.completed
   // - Create/update customer
   // - Record purchase
   // - Add session credits
   // - Send confirmation email
   ```

### Phase 3: Calendly Integration (Week 2)

1. **Set up Calendly webhooks**
   - Configure webhook URL in Calendly
   - Subscribe to `invitee.created` and `invitee.canceled` events

2. **Create webhook handler**
   ```typescript
   // /api/webhooks/calendly.ts
   // Handle booking events
   // - Verify customer has credits
   // - Deduct session credit
   // - Create booking record
   // - Send confirmation email
   ```

3. **Calendly API integration**
   - Get available time slots
   - Create events programmatically
   - Cancel/reschedule bookings

### Phase 4: Email System (Week 2-3)

1. **Email templates**
   - Purchase confirmation (with Calendly link)
   - Booking confirmation (with details)
   - Reminder (24h before)
   - Low credits warning
   - Session expiry warning

2. **Email service setup**
   ```typescript
   // /lib/email/index.ts
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export async function sendPurchaseConfirmation(customer, purchase) {
     // Include SwingStick info if purchased
     // Include Calendly booking link
     // Show total sessions purchased
   }
   ```

3. **Automated email triggers**
   - Cron job for reminders (Vercel Cron or Supabase Edge Functions)
   - Low credit alerts (< 3 sessions)
   - Expiry warnings (30 days before)

### Phase 5: Customer Portal (Week 3)

1. **Authentication**
   - Magic link login via email
   - Session management with Supabase Auth

2. **Customer dashboard pages**
   - `/account` - Overview
   - `/account/sessions` - Credit balance & history
   - `/account/bookings` - Upcoming & past rentals
   - `/account/purchases` - Purchase history

3. **Features**
   - View remaining sessions
   - See booking history
   - Download receipts
   - Update contact info

### Phase 6: Admin Dashboard (Week 3-4)

1. **Admin authentication**
   - Separate admin role in Supabase
   - Protected routes

2. **Admin pages**
   - `/admin` - Dashboard overview
   - `/admin/customers` - Customer management
   - `/admin/bookings` - All bookings calendar view
   - `/admin/sessions` - Manual session adjustments
   - `/admin/emails` - Email log viewer

3. **Manual operations**
   - Add/remove sessions
   - Create manual bookings
   - Send custom emails
   - Export reports

### Phase 7: Improvements & Polish (Week 4)

1. **UI Updates**
   - Update landing page with new checkout flow
   - Add "Login" button for returning customers
   - Show dynamic pricing based on existing credits

2. **Advanced features**
   - Package upgrades (e.g., upgrade 3-pack to 10-pack)
   - Referral program
   - Loyalty rewards
   - Gift purchases

3. **Analytics & Reporting**
   - Revenue analytics
   - Usage patterns
   - Customer retention metrics
   - SwingStick adoption rate

## API Endpoints Summary

```typescript
// Customer-facing APIs
POST   /api/checkout/create-session
GET    /api/customers/me
GET    /api/customers/me/credits
GET    /api/customers/me/bookings
POST   /api/auth/magic-link

// Webhook endpoints
POST   /api/webhooks/stripe
POST   /api/webhooks/calendly

// Admin APIs
GET    /api/admin/customers
POST   /api/admin/customers/[id]/adjust-credits
GET    /api/admin/bookings
POST   /api/admin/bookings/manual
GET    /api/admin/reports/revenue
```

## Security Considerations

1. **API Security**
   - Validate webhook signatures
   - Rate limiting on all endpoints
   - CORS configuration
   - Input validation with Zod

2. **Database Security**
   - Row Level Security policies
   - Encrypted sensitive data
   - Regular backups

3. **Authentication**
   - JWT tokens with short expiry
   - Secure magic links
   - Admin 2FA (optional)

## Monitoring & Maintenance

1. **Error tracking**
   - Sentry integration
   - Webhook failure alerts
   - Email delivery monitoring

2. **Performance**
   - Database query optimization
   - Caching strategy
   - CDN for static assets

3. **Backups**
   - Daily database backups
   - Transaction logs
   - Customer data export capability

## Migration Strategy

1. **Data migration**
   - Import existing Stripe customers
   - Backfill purchase history
   - Honor existing bookings

2. **Gradual rollout**
   - Test with small group
   - Feature flags for new functionality
   - Maintain old checkout links during transition

## Cost Estimates

- **Supabase**: Free tier should suffice initially
- **Stripe**: 2.9% + $0.30 per transaction
- **Resend/SendGrid**: ~$20/month for email volume
- **Calendly**: Existing plan
- **Vercel**: Free tier for hosting

## Success Metrics

- Session utilization rate
- Customer retention
- SwingStick attachment rate
- Email engagement rates
- Support ticket reduction
- Revenue per customer increase

## Timeline

- **Week 1**: Database setup, Stripe API basics
- **Week 2**: Calendly integration, email system
- **Week 3**: Customer portal, admin dashboard
- **Week 4**: Testing, polish, migration

Total estimated time: 4 weeks for full implementation

## Next Steps

1. Review and approve plan
2. Set up development environment
3. Create Supabase project and run migrations
4. Begin Phase 1 implementation