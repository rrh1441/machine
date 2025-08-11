# End-to-End Testing Guide for Seattle Ball Machine Automation

## Overview
This guide walks through testing the complete automation workflow from purchase to booking to reminders.

## Prerequisites
- [ ] Stripe webhook configured at `https://www.seattleballmachine.com/api/webhooks/stripe`
- [ ] Environment variables set in Vercel
- [ ] Supabase database accessible
- [ ] Test checkout codes configured in Stripe

## Supabase Tables to Monitor

### 1. **customers** table
```sql
-- Check if customer was created/updated
SELECT * FROM customers ORDER BY created_at DESC LIMIT 5;
```
**Expected fields:**
- `email` - Customer email
- `name` - Customer name
- `phone` - Customer phone (if provided)
- `stripe_customer_id` - Stripe's customer ID
- `created_at` - When record was created

### 2. **purchases** table
```sql
-- Check purchase records
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5;
```
**Expected fields:**
- `customer_id` - Links to customers table
- `stripe_payment_intent_id` - Stripe payment ID
- `stripe_checkout_session_id` - Stripe session ID
- `package_type` - 'single', '3_pack', or '10_pack'
- `sessions_purchased` - 1, 3, or 10
- `amount_paid` - Amount in cents
- `includes_swingstick` - Boolean
- `swingstick_quantity` - Number of SwingSticks

### 3. **session_credits** table
```sql
-- Check session credits
SELECT * FROM session_credits ORDER BY created_at DESC LIMIT 5;
```
**Expected fields:**
- `customer_id` - Links to customers table
- `purchase_id` - Links to purchases table
- `sessions_remaining` - Available sessions
- `sessions_total` - Original number of sessions

### 4. **bookings** table (after Calendly booking)
```sql
-- Check bookings
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;
```
**Expected fields:**
- `customer_id` - Links to customers table
- `calendly_event_id` - Calendly's event UUID
- `booking_date` - Date of booking (YYYY-MM-DD)
- `booking_time` - Time of booking (HH:MM:SS)
- `booking_datetime` - Full timestamp
- `status` - 'scheduled', 'cancelled', etc.

### 5. **calendly_webhooks** table
```sql
-- Check Calendly webhook events
SELECT * FROM calendly_webhooks ORDER BY created_at DESC LIMIT 5;
```

### 6. **email_logs** table
```sql
-- Check email send logs
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 5;
```

## Test Workflow

### Phase 1: Purchase Testing

#### Test Case 1A: Single Session Purchase
1. **Action**: Click "Book Single Session" on homepage
2. **Use**: Test checkout code in Stripe checkout
3. **Verify in Supabase**:
   ```sql
   -- Check all related records for latest purchase
   SELECT * FROM customers WHERE email = 'your-test@email.com';
   SELECT * FROM purchases WHERE customer_id = (SELECT id FROM customers WHERE email = 'your-test@email.com');
   SELECT * FROM session_credits WHERE customer_id = (SELECT id FROM customers WHERE email = 'your-test@email.com');
   ```
4. **Expected**:
   - New customer record (or updated if exists)
   - Purchase record with `sessions_purchased = 1`
   - Session credit with `sessions_remaining = 1`
5. **Email Check**: Should receive purchase confirmation email with:
   - 1 session confirmation
   - Link to booking page
   - Pickup location

#### Test Case 1B: 3-Pack Purchase
1. **Action**: Click "3-Pack Sessions" 
2. **Verify**: 
   - Purchase with `sessions_purchased = 3`
   - Credit with `sessions_remaining = 3`

#### Test Case 1C: 10-Pack Purchase
1. **Action**: Click "10-Pack Sessions"
2. **Verify**: 
   - Purchase with `sessions_purchased = 10`
   - Credit with `sessions_remaining = 10`

#### Test Case 1D: SwingStick Add-on
1. **Action**: Click SwingStick upsell on booking page
2. **Verify**:
   - Purchase record with `includes_swingstick = true`
   - `swingstick_quantity = 1`

### Phase 2: Booking Testing (Calendly)

#### Test Case 2A: Book with Available Credits
1. **Prerequisites**: Complete a purchase first (have credits)
2. **Action**: Book a session on Calendly
3. **Verify in Supabase**:
   ```sql
   -- Check booking was created
   SELECT * FROM bookings WHERE customer_id = (SELECT id FROM customers WHERE email = 'your-test@email.com');
   
   -- Check session was deducted
   SELECT * FROM session_credits WHERE customer_id = (SELECT id FROM customers WHERE email = 'your-test@email.com');
   
   -- Check usage tracking
   SELECT * FROM session_usage ORDER BY created_at DESC LIMIT 1;
   ```
4. **Expected**:
   - New booking record with status 'scheduled'
   - Session credit reduced by 1
   - Session usage record created
5. **Email Check**: Booking confirmation with:
   - Date/time of booking
   - Sessions remaining count
   - Reschedule/cancel links

#### Test Case 2B: Book without Credits
1. **Prerequisites**: Use email with no credits
2. **Action**: Try to book on Calendly
3. **Expected**:
   - Warning email about no sessions
   - Booking may still be created but flagged

#### Test Case 2C: Cancel Booking
1. **Prerequisites**: Have an active booking
2. **Action**: Click cancel link in email or Calendly
3. **Verify**:
   ```sql
   -- Check booking status
   SELECT * FROM bookings WHERE calendly_invitee_id = 'xxx';
   
   -- Check credit was restored
   SELECT * FROM session_credits WHERE customer_id = (SELECT id FROM customers WHERE email = 'your-test@email.com');
   ```
4. **Expected**:
   - Booking status = 'cancelled'
   - Session credit restored (+1)
   - Cancellation email sent

### Phase 3: Reminder Testing

#### Test Case 3A: Daily Reminder Cron
1. **Setup**: Have a booking for tomorrow
2. **Action**: Trigger cron manually:
   ```bash
   curl https://www.seattleballmachine.com/api/cron/send-reminders
   ```
3. **Verify**:
   ```sql
   -- Check email logs
   SELECT * FROM email_logs WHERE email_type = 'booking_reminder' ORDER BY created_at DESC;
   ```
4. **Expected**: Reminder email for tomorrow's booking

### Phase 4: Customer Portal Testing

#### Test Case 4A: View Account
1. **Action**: Visit `/account?email=your-test@email.com`
2. **Verify**:
   - Shows correct session credits
   - Lists upcoming bookings
   - Shows past bookings
   - Contact information displayed

## Debugging Checklist

### If Purchase Email Doesn't Send:
- [ ] Check Stripe webhook logs: Dashboard → Developers → Webhooks → Click endpoint → Logs
- [ ] Check Vercel function logs: Vercel Dashboard → Functions tab
- [ ] Verify environment variables in Vercel
- [ ] Check Supabase tables - was data inserted?

### If Booking Doesn't Work:
- [ ] Verify Calendly webhook is configured
- [ ] Check `calendly_webhooks` table for raw events
- [ ] Verify customer exists in database with same email
- [ ] Check session credits are available

### Common Issues:
1. **No email sent but data in Supabase**: Resend API issue
2. **No data in Supabase**: Webhook not firing or database connection issue
3. **Webhook 503 error**: Missing environment variables
4. **Webhook 400 error**: Invalid signature (wrong webhook secret)

## Quick SQL Queries

```sql
-- Get full customer history
WITH customer AS (
  SELECT id FROM customers WHERE email = 'test@email.com'
)
SELECT 
  'customer' as type, c.* FROM customers c WHERE c.id = (SELECT id FROM customer)
UNION ALL
SELECT 
  'purchase' as type, p.* FROM purchases p WHERE p.customer_id = (SELECT id FROM customer)
UNION ALL
SELECT 
  'credits' as type, sc.* FROM session_credits sc WHERE sc.customer_id = (SELECT id FROM customer)
UNION ALL
SELECT 
  'booking' as type, b.* FROM bookings b WHERE b.customer_id = (SELECT id FROM customer)
ORDER BY created_at DESC;

-- Check today's activity
SELECT * FROM purchases WHERE created_at > NOW() - INTERVAL '1 day';
SELECT * FROM bookings WHERE created_at > NOW() - INTERVAL '1 day';
SELECT * FROM email_logs WHERE sent_at > NOW() - INTERVAL '1 day';
```

## Test Sequence Summary

1. **Purchase** → Check `customers`, `purchases`, `session_credits` tables + email
2. **Book** → Check `bookings`, `session_credits` (reduced), `session_usage` + email  
3. **Cancel** → Check `bookings` (status), `session_credits` (restored) + email
4. **Tomorrow** → Trigger reminder cron → Check `email_logs` + email
5. **Portal** → Visit `/account?email=xxx` → Verify display

## Success Criteria

✅ Purchase creates customer and credits
✅ Emails sent for all events
✅ Booking deducts session credit
✅ Cancellation restores credit
✅ Reminders sent day before
✅ Portal shows accurate data
✅ SwingStick purchases tracked

## Notes

- Use test checkout codes to avoid real charges
- Emails may take 30-60 seconds to arrive
- Check spam folder for emails from noreply@seattleballmachine.com
- Webhook logs in Stripe show detailed request/response data
- Vercel Functions tab shows execution logs and errors