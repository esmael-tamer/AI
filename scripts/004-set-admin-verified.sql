-- scripts/004-set-admin-verified.sql
-- Marks all existing admin users as email_verified = true.
-- Run this AFTER 003-email-verification.sql to prevent locking out admins.
-- Admin accounts are created manually and do not go through email verification.

UPDATE users SET email_verified = true WHERE role = 'admin';
