-- Migration: Add soft delete support to blog_posts
-- Run this before deploying the updated blog API route

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Index for faster filtering of non-deleted posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON blog_posts (deleted_at)
  WHERE deleted_at IS NULL;
