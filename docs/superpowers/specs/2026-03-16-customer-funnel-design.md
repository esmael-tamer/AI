# Customer Funnel — Email Verification + Phone + Onboarding

**Date:** 2026-03-16
**Status:** Approved

---

## Context

The current funnel has gaps: visitors build a demo store but drop off before signing up. After signup there is no email verification, no phone collection, and no guided path to requesting service activation. This spec closes those gaps.

---

## User Journey (end-to-end)

```
Homepage → Builder → Store Preview
    → Signup (name_ar + email + phone + password)
    → "Check your email" page (/verify-email)
    → Click verification link in email
    → GET /api/auth/verify-email?token=xxx&sid=SESSION_ID
    → email_verified = true, session created (cookies set on redirect response)
    → Store linked to account using sid param
    → Redirect: /portal?welcome=1
    → Dashboard: welcome banner + "Activate your store" CTA
    → Activation stepper (existing flow)
```

---

## Changes Required

### 1. Database Migration (`scripts/003-email-verification.sql`)

The `phone` column already exists in the `users` table — do NOT add it again.

Add only these three columns:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);
```

Also update the `User` type in `types/index.ts`:
```ts
email_verified: boolean
email_verification_token: string | null
email_verification_expires: string | null
```

### 2. Resend Integration

- Install: `pnpm add resend`
- Server-only env var: `RESEND_API_KEY` (from resend.com — free tier: 3,000 emails/month). **Must NOT have `NEXT_PUBLIC_` prefix.**
- Public env var: `NEXT_PUBLIC_APP_URL` (e.g. `https://mediatrend.com`) — used to construct verification links
- New lib file: `lib/email.ts` — exports `sendVerificationEmail(to: string, token: string, sid: string | null, lang: 'ar' | 'en')`

Verification link format: `${NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&sid=${sid ?? ''}`

Email template (bilingual HTML):
- Subject AR: `تأكيد بريدك الإلكتروني — Media Trend`
- Subject EN: `Verify your email — Media Trend`
- Body: branded dark HTML with lime-400 CTA button
- Token expires in 24 hours

### 3. Signup API (`app/api/auth/signup/route.ts`)

Changes:
- `phone` already saved — no change needed there
- Add `name_ar` as required (was optional); `name_en` stored as `null` (not collected on form — admin can fill later)
- After user insert: generate a random 64-char hex token via `crypto.randomBytes(32).toString('hex')`
- Save token + expiry (`NOW() + interval '24 hours'`) to `email_verification_token` / `email_verification_expires`
- Read `mt_session_id` from request cookies (set by builder) and pass to `sendVerificationEmail` as `sid`
- Call `sendVerificationEmail(email, token, sid, lang)`
- Set `email_verified = false` (default via DB)
- **Do NOT create session** — return `NextResponse.json({ pending: true })` with status 200
- Do NOT set `mt-session` or client identity cookies at this point

### 4. New API Route: `app/api/auth/verify-email/route.ts`

`GET /api/auth/verify-email?token=xxx&sid=yyy`

Steps:
1. Look up user: `SELECT * FROM users WHERE email_verification_token = $1`
2. If not found → return page redirect to `/verify-email?error=invalid`
3. If `email_verification_expires < NOW()` → redirect to `/verify-email?error=expired`
4. If already verified → redirect to `/login`
5. Update user: `SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL`
6. Link guest store: if `sid` param is non-empty, `UPDATE stores SET user_id = $userId WHERE session_id = $sid AND user_id IS NULL`
7. Create session using existing pattern:
   ```ts
   const sessionValue = createSessionValue(userId)
   const redirectResponse = NextResponse.redirect(new URL('/portal?welcome=1', request.url))
   redirectResponse.cookies.set('mt-session', sessionValue, { httpOnly: true, secure: ..., sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 })
   setClientIdentityCookies(redirectResponse, userId, 'customer')
   return redirectResponse
   ```
   **Both session cookie and client identity cookies must be set on the redirect response object before returning.**

### 5. New API Route: `app/api/auth/resend-verification/route.ts`

`POST` body: `{ email: string }`

Steps:
1. Extract IP from request headers
2. Rate limit key: `resend:${ip}:${email}` — limit: 3 per 10 minutes
   - Returns 200 even if email not found (prevents email enumeration)
3. Look up user by email — if not found, return `{ ok: true }` silently
4. If already verified → return `{ ok: true }` silently
5. Regenerate token + expiry
6. Read `mt_session_id` from request cookies for `sid`
7. Call `sendVerificationEmail(email, newToken, sid, lang)`
8. Return `{ ok: true }`

Note: The 60-second UI cooldown on the resend button is UX-only and trivially bypassable. The server-side rate limit (3 per 10 min) is the authoritative enforcement.

### 6. Signup Page (`app/signup/page.tsx`)

Form fields (all required):
- **Arabic name** (`name_ar`) — label AR: "الاسم"
- **Email** (`email`)
- **Phone** (`phone`) — hint text: `+966XXXXXXXXX` / `+965XXXXXXXX`
- **Password** (`password`)

`name_en` is not collected on the form — stored as `null`, admin can update later.

On successful submit (`{ pending: true }`):
- Store email in `sessionStorage` (for display on verify-email page)
- `router.push('/verify-email')`

On `409` (email exists): show "البريد الإلكتروني مسجّل مسبقاً"

### 7. New Page: `app/verify-email/page.tsx`

- Reads email from `sessionStorage` to display "أرسلنا رابط إلى [email]"
- If `?error=invalid` in URL: shows "رابط غير صالح"
- If `?error=expired` in URL: shows "رابط منتهي الصلاحية — اطلب رابطاً جديداً"
- Resend button:
  - On click → `POST /api/auth/resend-verification` with email from sessionStorage
  - UI cooldown: button disabled for 60 seconds after each click (client-side only)
  - Shows "تم الإرسال" confirmation on success
- Back link → `/login`

### 8. Login: Block Unverified Accounts (`app/api/auth/login/route.ts`)

After password verification:
- If `email_verified = false` and `role = 'customer'`:
  - Return `403 { error: "email_not_verified" }` — do NOT include email in response (client already has it from the form)
- Admin accounts (`role = 'admin'`) bypass this check — admins are created manually via seed and do not go through email verification

Login page: on `403 error: "email_not_verified"`:
- Show: "حسابك غير مفعّل. تحقق من بريدك أو"
- Link: "أعد إرسال رابط التأكيد" → `POST /api/auth/resend-verification` then redirect to `/verify-email`

### 9. Portal Welcome Banner (`app/portal/page.tsx`)

When `?welcome=1` in URL:
- Show full-width banner above all content:
  - AR: "🎉 مرحباً! متجرك التجريبي جاهز. اطلب التفعيل لبدء البيع الحقيقي."
  - EN: "🎉 Welcome! Your demo store is ready. Request activation to start selling."
  - CTA: "اطلب التفعيل الآن" → opens activation stepper for the first store
  - Dismiss button (X): hides banner + sets `localStorage.setItem('portal_welcome_dismissed', '1')`
- On mount: if `localStorage.getItem('portal_welcome_dismissed')` → do not show even if `?welcome=1`

---

## Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `RESEND_API_KEY` | Server-only (no NEXT_PUBLIC_ prefix) | From resend.com dashboard |
| `NEXT_PUBLIC_APP_URL` | Public | Full app URL, e.g. `https://mediatrend.com` |

---

## Files Changed / Created

| File | Action |
|---|---|
| `scripts/003-email-verification.sql` | New — DB migration (3 columns + index) |
| `types/index.ts` | Modified — add 3 fields to User type |
| `lib/email.ts` | New — Resend email helper |
| `app/api/auth/signup/route.ts` | Modified — require name_ar, generate token, no session |
| `app/api/auth/verify-email/route.ts` | New — token verification + session on redirect |
| `app/api/auth/resend-verification/route.ts` | New — regenerate + resend email |
| `app/api/auth/login/route.ts` | Modified — block unverified customers |
| `app/signup/page.tsx` | Modified — add name_ar + phone fields |
| `app/verify-email/page.tsx` | New — "check your email" page |
| `app/portal/page.tsx` | Modified — welcome banner |

---

## Error Handling Summary

| Scenario | Behavior |
|---|---|
| Token not found | Redirect `/verify-email?error=invalid` |
| Token expired | Redirect `/verify-email?error=expired` |
| Already verified | Redirect `/login` |
| Unverified login (customer) | 403, login page shows resend link |
| Admin login | Unaffected — no email_verified check |
| Resend for unknown email | Returns 200 silently (no enumeration) |
| Resend rate limit hit | 429, UI shows "انتظر قليلاً" |

---

## Out of Scope

- SMS / OTP verification
- OAuth (Google / Apple)
- Password reset flow
- `name_en` collection on signup form
