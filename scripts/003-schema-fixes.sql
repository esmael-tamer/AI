-- Media Trend Platform - Schema Fixes Migration
-- Run this on existing databases to align schema with application code

-- 1. Users table: add name_ar / name_en columns (keep name for backwards compat)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255),
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
  ALTER COLUMN name DROP NOT NULL;

-- Migrate existing name data to name_en
UPDATE users SET name_en = name WHERE name_en IS NULL AND name IS NOT NULL;

-- 2. Stores table: add plan column
ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS plan VARCHAR(50);

-- 3. Leads table: add type and payload_json columns
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS type VARCHAR(30),
  ADD COLUMN IF NOT EXISTS payload_json JSON DEFAULT '{}';

-- 4. Tickets table: expand CHECK constraint to include ads_launch_request and account_management_request
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_type_check;
ALTER TABLE tickets
  ADD CONSTRAINT tickets_type_check
    CHECK (type IN ('payments', 'shipping', 'warehousing', 'ads_launch_request', 'account_management_request'));
