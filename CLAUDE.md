# CLAUDE.md — AI Assistant Guide for Media Trend Platform

This file provides context for AI assistants (Claude, Copilot, etc.) working in this codebase.

---

## Project Overview

**Media Trend** is an AI-powered e-commerce platform targeting the MENA region (Kuwait, Saudi Arabia, UAE, Egypt, etc.). It operates on a **commission-only business model** with no subscriptions.

Key capabilities:
- AI-powered store builder (conversational UI)
- Full admin dashboard (stores, users, leads, tickets, blog, team, partners, case studies)
- Customer portal (store management, service activation, ticket tracking)
- Bilingual support: Arabic (RTL, default) + English (LTR)
- Commission tiers: Launch 5%, Growth 10%, Managed 25%
- WhatsApp integration for sales/support

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, Radix UI, shadcn/ui (new-york style) |
| Styling | Tailwind CSS v4, custom CSS animations |
| Database | PostgreSQL via `@neondatabase/serverless` or `postgres` |
| Auth | Custom session-based (cookie `mt-session`) |
| Forms | react-hook-form + zod validation |
| i18n | Custom React Context (`/lib/i18n.tsx`) |
| Icons | lucide-react |
| Package Manager | **pnpm** (do NOT use npm or yarn) |

---

## Repository Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, metadata, bilingual setup)
│   ├── page.tsx                # Homepage (hero, services, pricing, FAQ)
│   ├── login/                  # User login
│   ├── signup/                 # User registration
│   ├── builder/                # AI store builder (conversational UI)
│   ├── admin/                  # Admin dashboard & login
│   ├── blog/                   # Blog listing
│   ├── work/                   # Portfolio / case studies
│   ├── team/                   # Team page
│   ├── About/                  # About page
│   ├── contact/                # Contact form
│   ├── services/               # Services overview + sub-pages
│   ├── checkout/               # Checkout flow
│   ├── revisions/              # Revision history
│   ├── t&c/                    # Terms & Conditions
│   ├── s/[slug]/               # Dynamic public store pages
│   └── api/                    # API routes (see below)
│
├── components/                 # React components
│   ├── ui/                     # shadcn/ui primitives (46 components)
│   ├── client-layout.tsx       # Root wrapper with LanguageProvider
│   ├── mt-header.tsx           # Navigation with language switcher
│   ├── mt-hero.tsx             # Hero section with store builder input
│   ├── mt-services.tsx         # Services section
│   ├── pricing.tsx             # Commission plans
│   ├── faq.tsx                 # FAQ accordion
│   └── ...                     # ~78 total components
│
├── lib/
│   ├── db.ts                   # PostgreSQL connection + TypeScript types
│   ├── auth.ts                 # Session management, password hashing
│   ├── builder-engine.ts       # AI store builder configuration & logic
│   ├── i18n.tsx                # Bilingual Context (Arabic/English)
│   └── utils.ts                # clsx + tailwind-merge helper
│
├── hooks/                      # Custom React hooks
├── styles/                     # Global CSS
├── scripts/
│   ├── 001-create-tables.sql   # Database schema (12 tables)
│   └── 002-seed-data.sql       # Seed data (admin, team, partners, blog)
├── public/                     # Static assets (icons, images)
├── middleware.ts               # Route protection for /admin and /portal
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind config with HSL color variables
├── tsconfig.json               # TypeScript (strict, bundler resolution, @/* alias)
├── components.json             # shadcn/ui config
└── replit.md                   # Deployment & architecture guide
```

---

## API Routes

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login; sets `mt-session` cookie |
| POST | `/api/auth/signup` | Register; sets `mt-session` cookie |
| GET | `/api/auth/logout` | Logout; clears cookies |

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/stores` | Create demo store (AI builder) |
| POST | `/api/leads` | Capture lead for services |
| GET | `/api/geo` | Geolocation data |

### Admin (requires admin session)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| CRUD | `/api/admin/stores` | Store management |
| CRUD | `/api/admin/users` | User management |
| CRUD | `/api/admin/leads` | Lead management |
| CRUD | `/api/admin/tickets` | Activation tickets |
| CRUD | `/api/admin/blog` | Blog posts |
| CRUD | `/api/admin/pages` | CMS pages |
| CRUD | `/api/admin/team` | Team members |
| CRUD | `/api/admin/partners` | Partner logos |
| CRUD | `/api/admin/cases` | Case studies |
| GET | `/api/admin/audit` | Audit logs |

### Customer Portal (requires user session)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/portal/stores` | User's stores |
| GET | `/api/portal/tickets` | User's tickets |
| POST | `/api/portal/activate` | Request service activation |

---

## Database Schema

12 PostgreSQL tables. Connection via `DATABASE_URL` environment variable.

```
users            — platform users (roles: admin, customer)
stores           — e-commerce stores (status: draft, pending, live, suspended)
products         — store products
leads            — sales leads (status: new, contacted, qualified, closed)
tickets          — service activation tickets (type: payments, shipping, warehousing, ads_launch_request, account_management_request)
support_tickets  — customer support tickets
pages            — CMS pages
blog_posts       — blog articles
partners         — partner company logos
team_members     — team profiles
case_studies     — portfolio/work entries
audit_logs       — admin action logs
```

To initialize the database, run scripts in order:
```bash
psql $DATABASE_URL -f scripts/001-create-tables.sql
psql $DATABASE_URL -f scripts/002-seed-data.sql
```

---

## Authentication & Authorization

- **Session cookie:** `mt-session` (httpOnly, secure in production)
- **Format:** `{userId}:{token}` — 7-day expiration
- **Password hashing:** SHA-256 with salt `"mediatrend-salt-2024"` (in `lib/auth.ts`)
- **Client cookies:** `user_id`, `user_role` (non-httpOnly, readable by client JS)
- **Middleware** (`middleware.ts`) protects `/admin/*` and `/portal/*` — redirects unauthorized to `/login` or `/admin/login`
- Use `requireAuth()` and `requireAdmin()` from `lib/auth.ts` in API routes

---

## Internationalization (i18n)

The platform is bilingual: **Arabic (ar, RTL, default)** and **English (en, LTR)**.

- Language state lives in `LanguageProvider` (`lib/i18n.tsx`)
- Access with `useLanguage()` hook — returns `{ language, setLanguage, t, dir, isRTL }`
- `t(ar, en)` returns the string for the current language
- Bilingual fields in DB are named `*_ar` / `*_en` (e.g., `name_ar`, `name_en`)
- The `<html>` tag `lang` and `dir` attributes are set dynamically via `ClientLayout`

**Always provide both Arabic and English content** when adding any user-facing text or database records.

---

## Design System & Styling

- **Design aesthetic:** Dark premium ("Skitbit style") — black background, `lime-400` accent color
- **Color system:** HSL CSS variables defined in Tailwind config (`background`, `foreground`, `card`, `primary`, `secondary`, `accent`, etc.)
- **Dark mode:** Class-based (`dark:` prefix)
- **Component library:** shadcn/ui with `new-york` style — import from `@/components/ui/`
- **Icons:** lucide-react exclusively
- **Animations:** `tailwindcss-animate` and `tw-animate-css`
- **3D effects:** `ogl` library for WebGL (used in 3D demo pages)
- **Carousel:** `embla-carousel-react`

When styling, prefer Tailwind utility classes. Avoid inline styles unless absolutely necessary.

---

## Key Conventions

### TypeScript
- Strict mode is enabled — all code must be type-safe
- Path alias `@/*` maps to the repository root (e.g., `import { cn } from '@/lib/utils'`)
- TypeScript errors are currently ignored in builds (`next.config.mjs`) — fix them anyway

### Component Patterns
- Pages are in `/app/` using Next.js App Router conventions
- Shared UI primitives go in `/components/ui/` (shadcn/ui)
- Feature components go in `/components/`
- Use `'use client'` directive only when hooks or browser APIs are needed
- Server Components are the default — prefer them for data-fetching pages

### Form Handling
- Use `react-hook-form` + `zod` for all forms
- Validation schemas should be defined with `zod` and resolved via `@hookform/resolvers/zod`

### Database Access
- Import `sql` from `lib/db.ts` for parameterized queries
- Use template literal syntax: `` sql`SELECT * FROM users WHERE id = ${id}` ``
- Never concatenate user input into SQL strings

### API Routes
- All API route files export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Return `NextResponse.json(...)` with appropriate HTTP status codes
- Admin routes must call `requireAdmin()` at the top
- User routes must call `requireAuth()` at the top

### File Naming
- Pages: `page.tsx` inside named directories (Next.js App Router convention)
- Components: kebab-case (e.g., `mt-header.tsx`, `client-layout.tsx`)
- Lib files: kebab-case (e.g., `builder-engine.ts`)

---

## Development Workflow

### Setup
```bash
# Install dependencies (pnpm only)
pnpm install

# Set environment variable
export DATABASE_URL="your_postgres_connection_string"

# Initialize database
psql $DATABASE_URL -f scripts/001-create-tables.sql
psql $DATABASE_URL -f scripts/002-seed-data.sql

# Start dev server (port 5000)
pnpm dev
```

### Scripts
```bash
pnpm dev       # Development server on :5000
pnpm build     # Production build
pnpm start     # Production server on :5000
pnpm lint      # ESLint (note: currently not enforced in build)
```

### Environment Variables
| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

---

## No Tests or CI/CD

- There are **no test files** and **no testing framework** configured
- There is **no CI/CD pipeline** (no `.github/workflows/`)
- When adding new features, manually test through the UI and API endpoints
- Consider adding Vitest + React Testing Library if tests are needed

---

## Known Quirks & Gotchas

1. **Build errors are suppressed** — `next.config.mjs` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` to `true`. Fix TypeScript errors locally; don't rely on the build to catch them.

2. **Images are unoptimized** — `images: { unoptimized: true }` in `next.config.mjs`. This is intentional for Replit compatibility.

3. **SHA-256 password hashing** — The auth system uses a simple SHA-256 hash (not bcrypt). This is weaker than industry standard. Do not change the salt without migrating existing passwords.

4. **pnpm only** — A `pnpm-lock.yaml` is committed. Always use `pnpm`, never `npm install` or `yarn`.

5. **Arabic is the default language** — The `LanguageProvider` defaults to `'ar'`. All new copy should be written in Arabic first, then English.

6. **Dynamic route `/s/[slug]`** — Public store pages are served here. The slug must be unique across all stores.

7. **Admin seed user** — After running seed script, there is a default admin account. Check `scripts/002-seed-data.sql` for credentials (change in production).

8. **Tailwind v4** — This project uses Tailwind CSS v4 with `@tailwindcss/postcss` — not the classic `tailwindcss` PostCSS plugin. Syntax and configuration differ slightly from v3.

---

## Deployment

The project is designed for **Replit** deployment (PostgreSQL provided automatically) but is also Vercel-compatible.

- **Port:** 5000 (configured in `package.json` scripts)
- **Database:** Provide `DATABASE_URL` as an environment variable
- See `replit.md` for full deployment notes and recent changelog

---

## Quick Reference — Common Tasks

**Add a new page:**
Create `/app/<page-name>/page.tsx`. Add `'use client'` if needed. Use `useLanguage()` for bilingual text.

**Add a new API endpoint:**
Create `/app/api/<route>/route.ts`. Export `GET`/`POST`/etc. functions. Call `requireAuth()` or `requireAdmin()` as needed.

**Add a new DB table:**
Add `CREATE TABLE` to a new migration script in `/scripts/`. Update type definitions in `lib/db.ts`.

**Add a new shadcn/ui component:**
Run `pnpm dlx shadcn@latest add <component>` — it will place the file in `/components/ui/`.

**Add bilingual text:**
Use `t('النص العربي', 'English text')` from `useLanguage()` hook. Always provide both languages.
