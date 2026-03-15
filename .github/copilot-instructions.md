# Copilot Instructions for Media Trend

## Project Overview

**Media Trend** is an AI-powered e-commerce platform for the MENA region (Kuwait, Saudi Arabia, UAE, Egypt). It uses a commission-only model (Launch 5%, Growth 10%, Managed 25%) with no subscriptions.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, shadcn/ui (new-york style), Radix UI
- **Styling:** Tailwind CSS v4 (not v3 — syntax differs)
- **Database:** PostgreSQL via `@neondatabase/serverless` or `postgres`
- **Auth:** Custom session-based (cookie `mt-session`)
- **Forms:** react-hook-form + zod + `@hookform/resolvers/zod`
- **Icons:** lucide-react (exclusively)
- **Package manager:** **pnpm only** — never use npm or yarn

## Critical Rules

### Package Manager
Always use `pnpm`. Never suggest `npm install` or `yarn`.

### Internationalization
- The platform is bilingual: **Arabic (ar, RTL, default)** and **English (en, LTR)**
- Always use the `useLang()` hook (not `useLanguage`) from `lib/i18n.tsx`
- Use `t('النص العربي', 'English text')` for all user-facing strings
- Bilingual database fields are named `*_ar` / `*_en` (e.g., `name_ar`, `name_en`)
- Arabic is the default — write Arabic content first, then English

### Authentication in API Routes
- **Admin routes:** Use `checkAdminAuth()` from `lib/admin-auth.ts`
  ```ts
  import { checkAdminAuth } from "@/lib/admin-auth"
  const authError = await checkAdminAuth()
  if (authError) return authError
  ```
- **Portal routes:** Use `requireAuth()` from `lib/auth.ts`
  ```ts
  import { requireAuth } from "@/lib/auth"
  const user = await requireAuth()
  ```

### Database Access
- Import `sql` from `lib/db.ts` and use parameterized template literals:
  ```ts
  import { sql } from "@/lib/db"
  const result = await sql`SELECT * FROM users WHERE id = ${id}`
  ```
- **Never** concatenate user input into SQL strings

### Client-Side API Calls
Use the centralized service layer — do not write inline fetch calls in components:
```ts
import { api } from "@/lib/services/api"
const posts = await api.getPublishedPosts()
```
Add new methods to `lib/services/api.ts` when needed.

### React / Next.js
- Server Components are the default — prefer them for data-fetching
- Add `'use client'` only when the component uses hooks or browser APIs
- Pages go in `/app/<name>/page.tsx` (App Router convention)

## File & Folder Conventions

| Type | Location | Naming |
|---|---|---|
| Pages | `/app/<name>/page.tsx` | kebab-case directories |
| Layout components | `/components/layout/` | kebab-case `.tsx` |
| Homepage sections | `/components/sections/` | kebab-case `.tsx` |
| shadcn/ui primitives | `/components/ui/` | kebab-case `.tsx` |
| API routes | `/app/api/<route>/route.ts` | named exports: `GET`, `POST`, etc. |
| Lib utilities | `/lib/` | kebab-case `.ts` |

## Design System

- **Aesthetic:** Dark premium — black background, `lime-400` accent color
- **Components:** shadcn/ui with `new-york` style — import from `@/components/ui/`
- **Icons:** lucide-react exclusively
- **Styling:** Tailwind utility classes — avoid inline styles

## Form Handling

```ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })
const form = useForm({ resolver: zodResolver(schema) })
```

## API Route Template

```ts
import { NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/admin-auth" // or requireAuth for portal

export async function GET() {
  const authError = await checkAdminAuth()
  if (authError) return authError

  // ... query database
  return NextResponse.json({ data }, { status: 200 })
}
```

## Known Gotchas

1. **Build errors suppressed** — `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are `true` in `next.config.mjs`. Fix TS errors anyway.
2. **Images unoptimized** — `images: { unoptimized: true }` is set intentionally (Replit compatibility).
3. **SHA-256 password hashing** — uses salt `"mediatrend-salt-2024"`. Do not change without migrating passwords.
4. **Tailwind v4** — uses `@tailwindcss/postcss`, not the classic `tailwindcss` PostCSS plugin.
5. **HMAC-signed sessions** — format: `{userId}:{issuedAt}:{hmac}`. Set `SESSION_SECRET` env var in production.
6. **Port 5000** — dev server runs on port 5000, not 3000.

## Environment

- `DATABASE_URL` — required PostgreSQL connection string
- `SESSION_SECRET` — recommended for HMAC session signing

## Database Schema (12 tables)

`users`, `stores`, `products`, `leads`, `tickets`, `support_tickets`, `pages`, `blog_posts`, `partners`, `team_members`, `case_studies`, `audit_logs`
