# Media Trend - AI-Powered E-Commerce Platform

## Overview
A Next.js 14 application (App Router) for an AI-powered e-commerce platform with "Try First" model. Users build demo stores via AI chat without signup, then register and request activation (payments, shipping, warehousing). Revenue model: commission on sales only, no subscriptions.

## Recent Changes
- **2026-02-12**: Major development session
  - Migrated DB client from `@neondatabase/serverless` to `postgres` library (Replit PostgreSQL compatibility)
  - Built all 10 admin API routes with full CRUD (leads, tickets, stores, users, blog, pages, team, partners, cases, audit)
  - Built customer portal activation stepper (4-step flow: choose services → business details → review → confirm)
  - Created service pages: /services/ad-campaigns, /services/account-management with lead capture forms
  - Applied Skitbit dark design (black bg, lime-400 accent, glass morphism)
  - Fixed homepage (removed broken WebGL Plasma)
  - Portal now shows both support tickets and activation tickets
  
- **2026-02-12**: Migrated from Vercel to Replit
  - Removed `@vercel/analytics` and `@vercel/speed-insights`
  - Configured to bind to `0.0.0.0:5000`

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 with tw-animate-css
- **UI Components**: Radix UI primitives with shadcn/ui pattern
- **Database**: Replit PostgreSQL via `postgres` library (tagged template literals)
- **Auth**: Custom cookie-based session auth (middleware.ts + cookies: mt-session, user_id)

### Database Tables (12)
users, stores, products, leads, tickets, support_tickets, pages, blog_posts, partners, team_members, case_studies, audit_logs

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/api/admin/` - Admin CRUD APIs (10 routes)
- `app/api/portal/` - Customer portal APIs (stores, tickets, activate)
- `app/api/leads/` - Public lead capture API
- `app/services/` - Service pages (ad-campaigns, account-management)
- `components/` - React components (mt-header, mt-hero, mt-services, etc.)
- `lib/` - Utilities (db.ts, auth.ts, builder-engine.tsx)

### Environment Variables
- `DATABASE_URL` - Replit PostgreSQL connection string (auto-provided)

## User Preferences
- Communication always in Arabic
- Bilingual support (Arabic/English) in the platform
- E-commerce focused platform
- Dark premium design (Skitbit style)
- Commission-only business model (no subscriptions)
