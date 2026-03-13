-- Migration: Identify and flag legacy SHA-256 password accounts
-- Purpose: Force password reset for accounts still using the old SHA-256 hash format
--
-- Accounts using the old format will NOT have password_hash starting with "pbkdf2:"
-- These accounts should be forced to reset their password at next login.
--
-- Step 1: Add a force_password_reset flag column (if it doesn't exist)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS force_password_reset BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 2: Mark all legacy hash accounts (those not using PBKDF2 format)
UPDATE users
SET force_password_reset = TRUE
WHERE password_hash IS NOT NULL
  AND password_hash NOT LIKE 'pbkdf2:%';

-- Step 3: Verify — the following query should return 0 after the next login cycle
-- SELECT COUNT(*) FROM users WHERE force_password_reset = TRUE;
--
-- After all legacy accounts have reset their passwords, the legacy verification
-- paths in lib/auth.ts (lines 83-103) can be safely removed.
