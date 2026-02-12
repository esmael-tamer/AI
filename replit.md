# Media Trend - AI-Powered E-Commerce Platform

## Overview
A Next.js 14 application (App Router) for an AI-powered e-commerce platform. Migrated from Vercel to Replit.

## Recent Changes
- **2026-02-12**: Migrated from Vercel to Replit
  - Removed `@vercel/analytics` and `@vercel/speed-insights` imports from layout
  - Configured dev/start scripts to bind to `0.0.0.0:5000`
  - Updated `.gitignore` for Replit environment

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 with tw-animate-css
- **UI Components**: Radix UI primitives with shadcn/ui pattern
- **Database**: Neon (PostgreSQL serverless) via `@neondatabase/serverless`
- **Auth**: Custom cookie-based session auth (middleware.ts + lib/auth.ts)

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - React components (Radix-based UI)
- `lib/` - Utilities (db.ts, auth.ts)
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `styles/` - Global styles

### Environment Variables
- `DATABASE_URL` - Neon PostgreSQL connection string (required)

## User Preferences
- Bilingual support (Arabic/English)
- E-commerce focused platform
