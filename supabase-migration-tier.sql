-- MIGRATION: Add Tier-Based System to Bookings Table
-- Run this in Supabase SQL Editor AFTER the initial bookings table creation

-- Step 1: Add new tier-based columns
ALTER TABLE bookings
ADD COLUMN tier TEXT,
ADD COLUMN hours DECIMAL(10,2),
ADD COLUMN hourly_rate DECIMAL(10,2);

-- Step 2: Add check constraint for tier values
ALTER TABLE bookings
ADD CONSTRAINT valid_tier CHECK (tier IN ('essentials', 'signature', 'elite') OR tier IS NULL);

-- Step 3: Add comments for documentation
COMMENT ON COLUMN bookings.tier IS 'Tier type: essentials, signature, or elite. NULL for legacy bookings.';
COMMENT ON COLUMN bookings.hours IS 'Duration of assignment in hours (e.g., 3h for Essentials, 4h for Signature)';
COMMENT ON COLUMN bookings.hourly_rate IS 'Hourly rate based on tier: €180 (Essentials), €280 (Signature), €6000/month (Elite)';

-- Step 4: Create index for tier filtering (performance optimization)
CREATE INDEX idx_bookings_tier ON bookings(tier);
CREATE INDEX idx_bookings_date_tier ON bookings(date, tier);

-- Step 5: Optional - Migrate existing data (if you have legacy bookings)
-- Uncomment and adjust if needed:
/*
UPDATE bookings
SET 
  tier = 'essentials',
  hours = 3,
  hourly_rate = 180
WHERE service_type = 'hourly' AND tier IS NULL;

UPDATE bookings
SET 
  tier = 'signature',
  hours = 4,
  hourly_rate = 280
WHERE service_type = 'airport_transfer' AND tier IS NULL;
*/

-- Verification query - check the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('tier', 'hours', 'hourly_rate')
ORDER BY ordinal_position;
