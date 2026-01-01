-- Native Booking System Migration
-- Run this in your Supabase SQL editor

-- ============================================
-- 1. Business Hours Table
-- ============================================
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Enable RLS
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public availability)
CREATE POLICY "Business hours are publicly readable"
  ON business_hours FOR SELECT
  USING (true);

-- Insert default hours (adjust as needed)
INSERT INTO business_hours (day_of_week, start_time, end_time, is_available) VALUES
  (0, '08:00', '20:00', true),  -- Sunday
  (1, '06:00', '21:00', true),  -- Monday
  (2, '06:00', '21:00', true),  -- Tuesday
  (3, '06:00', '21:00', true),  -- Wednesday
  (4, '06:00', '21:00', true),  -- Thursday
  (5, '06:00', '21:00', true),  -- Friday
  (6, '08:00', '20:00', true)   -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- ============================================
-- 2. Blocked Times Table
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  source VARCHAR(50) DEFAULT 'manual', -- 'manual' | 'google_calendar_sync'
  google_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_blocked_times_range
  ON blocked_times(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_blocked_times_source
  ON blocked_times(source);

-- Enable RLS
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Blocked times are publicly readable"
  ON blocked_times FOR SELECT
  USING (true);

-- ============================================
-- 3. Bookings Table Updates
-- ============================================
-- Add columns for native booking support
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'calendly';

-- Update existing bookings to have calendly source
UPDATE bookings
SET booking_source = 'calendly'
WHERE booking_source IS NULL;

-- Index for filtering by source
CREATE INDEX IF NOT EXISTS idx_bookings_source
  ON bookings(booking_source);

-- ============================================
-- 4. Helper function: Get available slots for a date
-- ============================================
CREATE OR REPLACE FUNCTION get_business_hours_for_date(check_date DATE)
RETURNS TABLE(start_time TIME, end_time TIME, is_available BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT bh.start_time, bh.end_time, bh.is_available
  FROM business_hours bh
  WHERE bh.day_of_week = EXTRACT(DOW FROM check_date)::INT;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Helper function: Check if a time slot is blocked
-- ============================================
CREATE OR REPLACE FUNCTION is_slot_blocked(
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_times bt
    WHERE bt.start_datetime < slot_end
      AND bt.end_datetime > slot_start
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Helper function: Check if a time slot has a booking
-- ============================================
CREATE OR REPLACE FUNCTION is_slot_booked(
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.status = 'scheduled'
      AND b.booking_datetime < slot_end
      AND (b.booking_datetime + (COALESCE(b.duration_hours, 2) * INTERVAL '1 hour')) > slot_start
  );
END;
$$ LANGUAGE plpgsql;
