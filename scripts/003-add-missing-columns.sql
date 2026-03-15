-- Media Trend Platform - Migration 003
-- Add missing columns to align schema with application code

-- Add name_ar and name_en to users table
-- The original schema used a single `name` column, but the app uses name_ar/name_en
ALTER TABLE users ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Migrate existing data: copy name into name_ar for existing rows
UPDATE users SET name_ar = name WHERE name_ar IS NULL AND name IS NOT NULL AND name != '';

-- Add type column to leads table
-- portal/activate inserts type = 'store_activation', but this column was missing
ALTER TABLE leads ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'store_activation';

-- Add payload_json column to leads table
-- portal/activate inserts business_type into payload_json, but this column was missing
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payload_json JSON DEFAULT '{}';

-- Add status column to case_studies table
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published'));
