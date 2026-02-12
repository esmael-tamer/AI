# Media Trend - AI-Powered E-Commerce Platform

## Overview
A Next.js 14 application (App Router) for an AI-powered e-commerce platform with "Try First" model. Users build demo stores via AI chat without signup, then register and request activation (payments, shipping, warehousing). Revenue model: commission on sales only, no subscriptions. Target: Kuwait + Saudi (global-ready). Bilingual: Arabic + English.

## Recent Changes
- **2026-02-12**: Major Homepage Overhaul
  - Rewrote MTHero with new bilingual copy + store builder input field (text + mic + generate button)
  - Three CTAs: "Start building for free", "View our work", "Talk to our AI agent (WhatsApp)"
  - Trust line: "No subscriptions — commission on sales only (after activation)"
  - Created HowItWorks component (4-step flow: idea → demo → login → activation)
  - Reduced MTServices from 6 cards to 3 focused: AI Store Builder, Ad Campaigns, Account Management
  - Replaced Pricing with 3 commission plans: Launch 5%, Growth 10%, Managed 25% (no subscriptions)
  - Created FAQ component with 5 high-converting bilingual Q&As
  - Updated MTPartners from text names to real logo images (KNET, Visa, Apple Pay, Tap, MyFatoorah, Google, Meta, Mada, Precedence, Leswaq)
  - Updated MTCTA with WhatsApp button (wa.me/9656566179840)
  - Added WhatsApp contact info in footer
  - Homepage section order: Hero → HowItWorks → Services → Partners → Pricing → FAQ → CTA → Footer
  - Partner logos stored in public/images/partners/

- **2026-02-12**: Builder fixes
  - Fixed store creation (status 'demo' not 'draft' to match DB constraint)
  - Made AI responses bilingual in builder-engine.ts (getAIResponse accepts isAr parameter)
  - Fixed React strict mode duplicate key warnings with ref guard

- **2026-02-12**: Full bilingual system (Arabic/English)
  - Created `lib/i18n.tsx` with React Context-based language system (`LanguageProvider`, `useLang` hook)
  - `useLang()` provides: `t(en, ar)` translation function, `isAr` boolean, `dir` (rtl/ltr), `lang`, `setLang`
  - Language persisted in localStorage (`mt-lang`), default is Arabic
  - `components/client-layout.tsx` wraps app with LanguageProvider + dynamically sets HTML dir/lang
  - Updated all components: MTHeader (Globe language switcher), MTFooter, MTHero, MTServices, Pricing, MTPartners, MTCTA
  - Updated all pages: Services, Contact, Login, Signup, Ad-Campaigns, Account-Management
  - RTL support: ArrowRight rotates 180° when `isAr`, text-start used, dir attribute on root

- **2026-02-12**: Major development session
  - Migrated DB client from `@neondatabase/serverless` to `postgres` library (Replit PostgreSQL compatibility)
  - Built all 10 admin API routes with full CRUD (leads, tickets, stores, users, blog, pages, team, partners, cases, audit)
  - Built customer portal activation stepper (4-step flow: choose services → business details → review → confirm)
  - Created service pages: /services/ad-campaigns, /services/account-management with lead capture forms
  - Applied Skitbit dark design (black bg, lime-400 accent, glass morphism)
  - Portal now shows both support tickets and activation tickets

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
- `components/` - React components (mt-header, mt-hero, how-it-works, mt-services, mt-partners, pricing, faq, mt-cta, mt-footer)
- `lib/` - Utilities (db.ts, auth.ts, builder-engine.ts, i18n.tsx)
- `public/images/partners/` - Partner logo images

### Homepage Sections (in order)
1. MTHero (with store builder input)
2. HowItWorks (4 steps)
3. MTServices (3 cards)
4. MTPartners (logo marquee)
5. Pricing (3 commission plans)
6. FAQ (5 questions)
7. MTCTA (final CTA + WhatsApp)
8. MTFooter

### Commission Plans
- Launch: 5% commission (store + activation + shipping + warehousing + domain + support)
- Growth: 10% commission (all Launch + analytics + WhatsApp integration)
- Managed: 25% commission (all Launch + account manager + ads + operations + inventory + CS team + growth strategy)

### WhatsApp
- Official number: +9656566179840
- Link: https://wa.me/9656566179840

### Environment Variables
- `DATABASE_URL` - Replit PostgreSQL connection string (auto-provided)

## User Preferences
- Communication always in Arabic
- Bilingual support (Arabic/English) in the platform
- E-commerce focused platform targeting Kuwait & Saudi Arabia
- Dark premium design (Skitbit style: black bg, lime-400 accent, glass morphism)
- Commission-only business model (no subscriptions)
