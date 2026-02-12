# Copilot Instructions

## Project Overview

Media Trend is a bilingual (Arabic/English) AI-powered e-commerce platform built with **Next.js 14 App Router**, targeting Kuwait and Saudi Arabia. It uses a commission-based business model (no subscriptions). A legacy Skitbit 3D animation site coexists in the same repo under `app/3D-*` routes.

## Build & Run

- **Install dependencies**: `pnpm install` (or `npm install --legacy-peer-deps`)
- **Development server**: `pnpm dev` (runs on port 5000)
- **Production build**: `pnpm build`
- **Lint**: `pnpm lint`
- **TypeScript check**: `npx tsc --noEmit`
- There is no test framework configured in this project.

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, CSS custom properties (OKLch color space), dark mode via `next-themes`
- **UI Components**: Radix UI primitives + shadcn/ui pattern with CVA (class-variance-authority)
- **Database**: PostgreSQL via the `postgres` library (tagged template queries)
- **Forms**: react-hook-form + zod validation
- **Icons**: lucide-react
- **Toasts**: sonner
- **Charts**: recharts

## Project Structure

- `app/` — Next.js App Router pages and API routes
- `app/api/admin/` — Admin CRUD API routes
- `components/` — React components (page-level and shared)
- `components/ui/` — Reusable shadcn/ui-style primitives (Button, Dialog, etc.)
- `lib/db.ts` — Database connection and typed queries
- `lib/auth.ts` — Authentication helpers
- `lib/i18n.tsx` — Bilingual context provider (`useLang` hook)
- `lib/utils.ts` — `cn()` utility for Tailwind class merging
- `styles/globals.css` — Global styles and CSS variables
- `middleware.ts` — Route protection for `/admin` and `/portal`

## Coding Conventions

### TypeScript
- Use TypeScript for all new files. Prefer interfaces for object shapes and proper typing for database queries.
- Import paths use the `@/` alias (e.g., `@/lib/db`, `@/components/ui/button`).

### React Components
- Use functional components with hooks. No class components.
- Client components must include the `"use client"` directive at the top.
- Use the `cn()` utility from `@/lib/utils` for merging Tailwind classes.

### Bilingual / i18n
- All user-facing text must support both Arabic and English.
- Use the `useLang()` hook from `@/lib/i18n` which provides `t(en, ar)`, `lang`, `isAr`, and `dir`.
- Ensure RTL layout support: use logical properties (`text-start`, `ms-2`, `me-2`) instead of physical ones (`text-left`, `ml-2`, `mr-2`).

### Styling
- Use Tailwind CSS utility classes. The design uses a dark premium theme (black background, lime-400 accent, glassmorphism effects).
- Component variants are managed with `class-variance-authority` (CVA).

### API Routes
- Follow the Next.js App Router convention with `route.ts` files exporting named HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`).
- Use `NextRequest` and `NextResponse` from `next/server`.
- Use the `sql` tagged template from `@/lib/db` for database queries.
- Wrap handlers in try/catch and return appropriate error responses.

### Authentication
- Session-based auth using the `mt-session` cookie checked in middleware.
- Admin and portal routes are protected via `middleware.ts`.
