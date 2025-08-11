CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  package_type TEXT NOT NULL CHECK (package_type IN ('single', '3_pack', '10_pack')),
  sessions_purchased INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,
  includes_swingstick BOOLEAN DEFAULT FALSE,
  swingstick_quantity INTEGER DEFAULT 0,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchases_customer ON purchases(customer_id);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);

CREATE TABLE session_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  sessions_remaining INTEGER NOT NULL,
  sessions_total INTEGER NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_credits_customer ON session_credits(customer_id);
CREATE INDEX idx_session_credits_expires ON session_credits(expires_at);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  calendly_event_id TEXT UNIQUE,
  calendly_invitee_id TEXT UNIQUE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  booking_datetime TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER DEFAULT 2,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  includes_swingstick BOOLEAN DEFAULT FALSE,
  calendly_cancel_url TEXT,
  calendly_reschedule_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_calendly_event ON bookings(calendly_event_id);

CREATE TABLE session_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  session_credit_id UUID REFERENCES session_credits(id) ON DELETE CASCADE,
  sessions_used INTEGER DEFAULT 1,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_usage_booking ON session_usage(booking_id);
CREATE INDEX idx_session_usage_credit ON session_usage(session_credit_id);

CREATE TABLE manual_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('add_session', 'remove_session', 'extend_expiry', 'add_swingstick')),
  sessions_adjusted INTEGER,
  new_expiry_date TIMESTAMPTZ,
  reason TEXT NOT NULL,
  adjusted_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_adjustments_customer ON manual_adjustments(customer_id);

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'purchase_confirmation',
    'booking_confirmation',
    'booking_reminder',
    'booking_cancelled',
    'low_credits',
    'credits_expiring',
    'custom'
  )),
  sent_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  resend_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_customer ON email_logs(customer_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);

CREATE TABLE calendly_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendly_webhooks_event_id ON calendly_webhooks(event_id);
CREATE INDEX idx_calendly_webhooks_processed ON calendly_webhooks(processed);

CREATE OR REPLACE VIEW customer_overview AS
SELECT 
  c.id,
  c.email,
  c.name,
  c.phone,
  c.stripe_customer_id,
  COALESCE(SUM(sc.sessions_remaining), 0) as total_sessions_remaining,
  COALESCE(SUM(sc.sessions_total), 0) as total_sessions_purchased,
  COUNT(DISTINCT p.id) as total_purchases,
  COUNT(DISTINCT b.id) as total_bookings,
  MAX(b.booking_datetime) as last_booking,
  MIN(sc.expires_at) as next_expiry_date
FROM customers c
LEFT JOIN session_credits sc ON c.id = sc.customer_id
LEFT JOIN purchases p ON c.id = p.customer_id
LEFT JOIN bookings b ON c.id = b.customer_id
GROUP BY c.id, c.email, c.name, c.phone, c.stripe_customer_id;

CREATE OR REPLACE VIEW upcoming_bookings AS
SELECT 
  b.*,
  c.email,
  c.name,
  c.phone
FROM bookings b
JOIN customers c ON b.customer_id = c.id
WHERE b.booking_datetime > NOW()
  AND b.status = 'scheduled'
ORDER BY b.booking_datetime;

CREATE OR REPLACE FUNCTION get_available_sessions(p_customer_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(sessions_remaining) 
     FROM session_credits 
     WHERE customer_id = p_customer_id 
       AND sessions_remaining > 0
       AND (expires_at IS NULL OR expires_at > NOW())),
    0
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deduct_session(p_customer_id UUID, p_booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_credit_id UUID;
  v_sessions_available INTEGER;
BEGIN
  SELECT id INTO v_credit_id
  FROM session_credits
  WHERE customer_id = p_customer_id
    AND sessions_remaining > 0
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at
  LIMIT 1;

  IF v_credit_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE session_credits
  SET sessions_remaining = sessions_remaining - 1,
      updated_at = NOW()
  WHERE id = v_credit_id;

  INSERT INTO session_usage (booking_id, session_credit_id, sessions_used)
  VALUES (p_booking_id, v_credit_id, 1);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendly_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE email = auth.uid()::text)
  );

CREATE POLICY "Users can view own session credits" ON session_credits
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE email = auth.uid()::text)
  );

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE email = auth.uid()::text)
  );

CREATE POLICY "Service role has full access" ON customers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON purchases
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON session_credits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON session_usage
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON manual_adjustments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON calendly_webhooks
  FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_credits_updated_at BEFORE UPDATE ON session_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();