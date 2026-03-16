# Customer Funnel — Email Verification + Phone + Onboarding Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the signup funnel gap by adding email verification via Resend, requiring phone + Arabic name at signup, and showing a welcome onboarding banner in the portal after first login.

**Architecture:** New columns on `users` table for verification state; `lib/email.ts` sends bilingual HTML email via Resend; signup creates a pending user and defers session creation until email is verified; the verification endpoint creates the session and redirects to `/portal?welcome=1`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, PostgreSQL (neon), Resend npm package, `crypto.randomBytes`, existing `createSessionValue` / `setClientIdentityCookies` from `lib/auth.ts`, `checkRateLimit` / `getClientIp` from `lib/rate-limit.ts`, `useLang()` from `lib/i18n.tsx`.

---

## Chunk 1: Database + Types + Email Helper

### Task 1: DB Migration

**Files:**
- Create: `scripts/003-email-verification.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- scripts/003-email-verification.sql
-- Adds email verification columns to users table.
-- phone column already exists — do NOT add it again.

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);
```

- [ ] **Step 2: Run the migration against your database**

```bash
psql $DATABASE_URL -f scripts/003-email-verification.sql
```

Expected output: `ALTER TABLE`, `ALTER TABLE`, `ALTER TABLE`, `CREATE INDEX`

- [ ] **Step 3: Verify columns exist**

```bash
psql $DATABASE_URL -c "\d users" | grep -E "email_verified|verification"
```

Expected: three rows listing the new columns.

---

### Task 2: Update User Type

**Files:**
- Modify: `types/index.ts` (lines 10–21, the `User` type)

- [ ] **Step 1: Add three fields to the `User` type**

In `types/index.ts`, change the `User` type from:
```ts
export type User = {
  id: number
  name_ar: string | null
  name_en: string | null
  email: string
  password_hash: string
  phone: string | null
  role: UserRole
  lang_pref: string
  created_at: string
  updated_at: string
}
```
to:
```ts
export type User = {
  id: number
  name_ar: string | null
  name_en: string | null
  email: string
  password_hash: string
  phone: string | null
  role: UserRole
  lang_pref: string
  email_verified: boolean
  email_verification_token: string | null
  email_verification_expires: string | null
  created_at: string
  updated_at: string
}
```

- [ ] **Step 2: Confirm no TypeScript errors in the file**

```bash
npx tsc --noEmit 2>&1 | head -20
```

(Errors in other files are pre-existing and can be ignored for now — focus on `types/index.ts`.)

---

### Task 3: Install Resend and Create Email Helper

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Install Resend**

```bash
pnpm add resend
```

Expected: `+ resend@x.x.x` added to `package.json`.

- [ ] **Step 2: Create `lib/email.ts`**

```ts
// lib/email.ts
// Sends transactional emails via Resend.
// RESEND_API_KEY must NOT have the NEXT_PUBLIC_ prefix — server-only.

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000"

/**
 * Sends a bilingual email verification link to the user.
 * @param to      Recipient email address
 * @param token   64-char hex verification token
 * @param sid     Builder session ID (may be empty string or null)
 * @param lang    User's preferred language
 */
export async function sendVerificationEmail(
  to: string,
  token: string,
  sid: string | null,
  lang: "ar" | "en"
): Promise<void> {
  const link = `${APP_URL}/api/auth/verify-email?token=${token}&sid=${sid ?? ""}`

  const subject =
    lang === "ar"
      ? "تأكيد بريدك الإلكتروني — Media Trend"
      : "Verify your email — Media Trend"

  const html = `<!DOCTYPE html>
<html dir="${lang === "ar" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 32px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:20px;font-weight:900;color:#fff;">
            Media<span style="color:#a3e635;">Trend</span>
          </span>
        </td></tr>
        <tr><td style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;text-align:${lang === "ar" ? "right" : "left"};">
          ${lang === "ar"
            ? "<p>مرحباً،</p><p>اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك في ميديا ترند.</p><p>الرابط صالح لمدة 24 ساعة.</p>"
            : "<p>Hello,</p><p>Click the button below to verify your email address and activate your Media Trend account.</p><p>This link expires in 24 hours.</p>"}
        </td></tr>
        <tr><td align="center" style="padding:32px 0;">
          <a href="${link}" style="display:inline-block;background:#a3e635;color:#000;font-weight:700;font-size:15px;padding:14px 36px;border-radius:100px;text-decoration:none;">
            ${lang === "ar" ? "تأكيد البريد الإلكتروني" : "Verify Email"}
          </a>
        </td></tr>
        <tr><td style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;">
          ${lang === "ar"
            ? "إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد."
            : "If you didn't create this account, you can safely ignore this email."}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from: "Media Trend <noreply@mediatrend.com>",
    to,
    subject,
    html,
  })
}
```

- [ ] **Step 3: Verify TypeScript compiles without errors in this file**

```bash
npx tsc --noEmit 2>&1 | grep "lib/email"
```

Expected: no output (no errors).

- [ ] **Step 4: Add environment variables to your `.env.local` (or deployment config)**

```
RESEND_API_KEY=re_your_key_here
NEXT_PUBLIC_APP_URL=https://mediatrend.com
```

> Do NOT commit `.env.local`. These are secrets.

---

## Chunk 2: API Routes

### Task 4: Modify Signup Route

**Files:**
- Modify: `app/api/auth/signup/route.ts`

Current behavior: saves user, creates session, returns `{ user }`.
New behavior: saves user + verification token, sends email, returns `{ pending: true }` — NO session created.

- [ ] **Step 1: Replace `app/api/auth/signup/route.ts` with the new version**

```ts
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, isValidEmail, isValidPhone } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = checkRateLimit(ip, 5, 60 * 60 * 1000) // 5 signups per hour per IP
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const body = await request.json()
    const { email, password, name_ar, phone } = body

    // name_ar required
    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 })
    }
    if (name_ar.length > 100) {
      return NextResponse.json({ error: "Name must be at most 100 characters" }, { status: 400 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    if (password.length > 128) {
      return NextResponse.json({ error: "Password must be at most 128 characters" }, { status: 400 })
    }

    // phone required
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "رقم الهاتف مطلوب" }, { status: 400 })
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Phone number must be in E.164 format (e.g. +96512345678)" },
        { status: 400 }
      )
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    // Generate 64-char hex verification token (32 random bytes)
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const verificationToken = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("")

    const newUser = await sql`
      INSERT INTO users (
        email, password_hash, name_ar, name_en, phone, role,
        email_verified, email_verification_token, email_verification_expires
      )
      VALUES (
        ${email}, ${passwordHash}, ${name_ar.trim()}, ${null}, ${phone.trim()}, 'customer',
        false, ${verificationToken}, NOW() + INTERVAL '24 hours'
      )
      RETURNING id, email, name_ar, role
    `

    const user = newUser[0]

    // Read session_id from cookie (set by builder) — do NOT store it, pass in email link
    const cookieHeader = request.headers.get("cookie") || ""
    const sidMatch = cookieHeader.match(/mt_session_id=([^;]+)/)
    const sid = sidMatch ? sidMatch[1] : null

    // Detect language preference from Accept-Language header
    const acceptLang = request.headers.get("accept-language") || ""
    const lang: "ar" | "en" = acceptLang.includes("ar") ? "ar" : "en"

    try {
      await sendVerificationEmail(email, verificationToken, sid, lang)
    } catch (emailErr) {
      logger.error("api", "Failed to send verification email", emailErr)
      // Still return pending — user can resend
    }

    // Do NOT create session — pending email verification
    return NextResponse.json({ pending: true }, { status: 200 })
  } catch (error) {
    logger.error("api", "Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Manually test the endpoint**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name_ar":"تجربة","phone":"+96512345678"}'
```

Expected: `{"pending":true}` with status 200.
Check your Resend dashboard — a test email should appear (or fail gracefully if key not set).

- [ ] **Step 3: Test validation — missing name_ar**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"test1234","phone":"+96512345678"}'
```

Expected: `{"error":"الاسم مطلوب"}` with status 400.

- [ ] **Step 4: Test 409 on duplicate email**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name_ar":"تجربة","phone":"+96512345678"}'
```

Expected: `{"error":"User already exists"}` with status 409.

---

### Task 5: Create Verify-Email Route

**Files:**
- Create: `app/api/auth/verify-email/route.ts`

- [ ] **Step 1: Create the file**

```ts
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createSessionValue, SESSION_MAX_AGE, setClientIdentityCookies } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const sid = searchParams.get("sid") || ""

    if (!token) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
    }

    const users = await sql`
      SELECT * FROM users WHERE email_verification_token = ${token}
    `

    if (users.length === 0) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
    }

    const user = users[0]

    // Check expiry
    const expires = new Date(user.email_verification_expires)
    if (expires < new Date()) {
      return NextResponse.redirect(new URL("/verify-email?error=expired", request.url))
    }

    // Already verified — send to login
    if (user.email_verified) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Mark as verified, clear token
    await sql`
      UPDATE users
      SET email_verified = true,
          email_verification_token = NULL,
          email_verification_expires = NULL,
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Link guest store if sid provided
    if (sid) {
      await sql`
        UPDATE stores
        SET user_id = ${user.id}
        WHERE session_id = ${sid} AND user_id IS NULL
      `
    }

    // Create session and set cookies on the redirect response
    const sessionValue = await createSessionValue(user.id)
    const redirectResponse = NextResponse.redirect(new URL("/portal?welcome=1", request.url))

    redirectResponse.cookies.set("mt-session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })

    setClientIdentityCookies(redirectResponse, user.id, "customer")

    return redirectResponse
  } catch (error) {
    logger.error("api", "Email verification error:", error)
    return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
  }
}
```

> **Note on `stores.user_id`:** The stores table uses `owner_id`, not `user_id`. Check the schema: if the FK column is `owner_id`, change `SET user_id = ${user.id}` to `SET owner_id = ${user.id}` in the UPDATE above. Verify with:
> ```bash
> psql $DATABASE_URL -c "\d stores" | grep -E "owner|user"
> ```

- [ ] **Step 2: Verify the column name for store ownership**

```bash
psql $DATABASE_URL -c "\d stores" | grep -E "owner_id|user_id"
```

If the column is `owner_id`, update the UPDATE query in this file to `SET owner_id = ${user.id}`.

- [ ] **Step 3: Manual test — valid token flow**

Insert a test token directly and follow the link:
```bash
psql $DATABASE_URL -c "
  UPDATE users
  SET email_verification_token = 'testtoken123',
      email_verification_expires = NOW() + INTERVAL '1 hour',
      email_verified = false
  WHERE email = 'test@example.com'
  RETURNING id;
"
```

Then visit: `http://localhost:5000/api/auth/verify-email?token=testtoken123&sid=`

Expected: redirect to `/portal?welcome=1` with `mt-session` cookie set.

- [ ] **Step 4: Manual test — invalid token**

Visit: `http://localhost:5000/api/auth/verify-email?token=badtoken`

Expected: redirect to `/verify-email?error=invalid`.

- [ ] **Step 5: Manual test — expired token**

```bash
psql $DATABASE_URL -c "
  UPDATE users
  SET email_verification_token = 'expiredtoken',
      email_verification_expires = NOW() - INTERVAL '1 hour',
      email_verified = false
  WHERE email = 'test@example.com';
"
```

Visit: `http://localhost:5000/api/auth/verify-email?token=expiredtoken`

Expected: redirect to `/verify-email?error=expired`.

---

### Task 6: Create Resend-Verification Route

**Files:**
- Create: `app/api/auth/resend-verification/route.ts`

- [ ] **Step 1: Create the file**

```ts
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isValidEmail } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const body = await request.json()
    const { email } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: true }) // Silent — no enumeration
    }

    // Rate limit per IP + email combination
    const rlKey = `resend:${ip}:${email}`
    const rl = checkRateLimit(rlKey, 3, 10 * 60 * 1000) // 3 per 10 minutes
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "انتظر قليلاً قبل إعادة الإرسال" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`
    if (users.length === 0) {
      return NextResponse.json({ ok: true }) // Silent — no enumeration
    }

    const user = users[0]

    if (user.email_verified) {
      return NextResponse.json({ ok: true }) // Already verified — silent
    }

    // Regenerate token + expiry
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const newToken = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("")

    await sql`
      UPDATE users
      SET email_verification_token = ${newToken},
          email_verification_expires = NOW() + INTERVAL '24 hours',
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Read session_id from cookie
    const cookieHeader = request.headers.get("cookie") || ""
    const sidMatch = cookieHeader.match(/mt_session_id=([^;]+)/)
    const sid = sidMatch ? sidMatch[1] : null

    const acceptLang = request.headers.get("accept-language") || ""
    const lang: "ar" | "en" = acceptLang.includes("ar") ? "ar" : "en"

    try {
      await sendVerificationEmail(email, newToken, sid, lang)
    } catch (emailErr) {
      logger.error("api", "Failed to resend verification email", emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error("api", "Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test resend for unknown email (should return 200 silently)**

```bash
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"nobody@nowhere.com"}'
```

Expected: `{"ok":true}` with status 200.

- [ ] **Step 3: Test rate limiting**

Call the endpoint 4 times quickly for the same email:
```bash
for i in 1 2 3 4; do
  curl -s -X POST http://localhost:5000/api/auth/resend-verification \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'; echo
done
```

Expected: first 3 return `{"ok":true}`, 4th returns status 429.

---

### Task 7: Modify Login Route — Block Unverified Customers

**Files:**
- Modify: `app/api/auth/login/route.ts`

- [ ] **Step 1: Add email_verified check after password verification**

In `app/api/auth/login/route.ts`, find the block after `verifyPassword` succeeds (after `if (!isValid)`) and add the unverified check before the session is created:

Change:
```ts
    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`

    const sessionValue = await createSessionValue(user.id)
```

To:
```ts
    // Block unverified customer accounts
    if (!user.email_verified && user.role === "customer") {
      return NextResponse.json({ error: "email_not_verified" }, { status: 403 })
    }

    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`

    const sessionValue = await createSessionValue(user.id)
```

- [ ] **Step 2: Test — login with unverified account**

```bash
# Ensure test@example.com has email_verified = false
psql $DATABASE_URL -c "UPDATE users SET email_verified = false WHERE email = 'test@example.com';"

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

Expected: `{"error":"email_not_verified"}` with status 403.

- [ ] **Step 3: Test — admin login bypasses check**

```bash
# Seed script creates admin@mediatrend.com — check scripts/002-seed-data.sql for password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mediatrend.com","password":"your_admin_password"}'
```

Expected: successful login with `mt-session` cookie (admin has `email_verified = false` by default from old rows, but role is 'admin' so the check is bypassed).

> **Note:** If existing admin rows have `email_verified = false` and the check fires, run:
> ```bash
> psql $DATABASE_URL -c "UPDATE users SET email_verified = true WHERE role = 'admin';"
> ```

- [ ] **Step 4: Test — verified customer can login**

```bash
psql $DATABASE_URL -c "UPDATE users SET email_verified = true WHERE email = 'test@example.com';"

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

Expected: `{"user":{...}}` with `mt-session` cookie.

---

## Chunk 3: UI Pages

### Task 8: Update Signup Page

**Files:**
- Modify: `app/signup/page.tsx`

Changes needed:
1. Remove `name_en` field (not collected)
2. Make `name_ar`, `phone` required with `required` attribute and validation
3. On success (`pending: true`): store email in `sessionStorage`, redirect to `/verify-email`
4. On `409`: show bilingual duplicate email error

- [ ] **Step 1: Replace `app/signup/page.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLang } from "@/lib/i18n"

export default function SignupPage() {
  const router = useRouter()
  const { t, isAr } = useLang()
  const [form, setForm] = useState({
    email: "",
    password: "",
    name_ar: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name_ar: form.name_ar,
          phone: form.phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(t("البريد الإلكتروني مسجّل مسبقاً", "Email already registered"))
        } else {
          setError(data.error || t("Signup failed", "فشل إنشاء الحساب"))
        }
        return
      }

      // pending: true — store email for verify-email page display
      sessionStorage.setItem("mt_pending_email", form.email)
      router.push("/verify-email")
    } catch {
      setError(t("Something went wrong", "حدث خطأ ما"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              Media<span className="text-lime-400">Trend</span>
            </h1>
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">{t("Create your account", "أنشئ حسابك")}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="name_ar" className="text-zinc-300 text-sm">
                {t("Name", "الاسم")}
              </Label>
              <Input
                id="name_ar"
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                placeholder="الاسم"
                dir="rtl"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">
                {t("Email", "البريد الإلكتروني")}
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-zinc-300 text-sm">
                {t("Phone", "الهاتف")}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+966XXXXXXXXX / +965XXXXXXXX"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-zinc-300 text-sm">
                {t("Password", "كلمة المرور")}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t("Min 8 characters", "8 أحرف على الأقل")}
                required
                minLength={8}
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-300 text-black font-semibold h-11 rounded-xl transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {t("Creating account...", "جاري الإنشاء...")}
                </span>
              ) : (
                t("Create Account", "إنشاء الحساب")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              {t("Already have an account? ", "لديك حساب بالفعل؟ ")}
              <Link href="/login" className="text-lime-400 hover:text-lime-300 transition-colors">
                {t("Sign In", "تسجيل الدخول")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Manually test the signup form in browser**

1. Go to `http://localhost:5000/signup`
2. Fill all fields and submit
3. Expect redirect to `/verify-email`
4. Check `sessionStorage.mt_pending_email` in browser DevTools — should hold the email

---

### Task 9: Create Verify-Email Page

**Files:**
- Create: `app/verify-email/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useLang } from "@/lib/i18n"
import { Mail, RefreshCw, AlertCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const [email, setEmail] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  useEffect(() => {
    setEmail(sessionStorage.getItem("mt_pending_email"))
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleResend() {
    if (!email || cooldown > 0 || resendStatus === "sending") return
    setResendStatus("sending")

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.status === 429) {
        setResendStatus("error")
        setCooldown(60)
      } else {
        setResendStatus("sent")
        setCooldown(60)
      }
    } catch {
      setResendStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lime-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-2xl font-bold text-white">
            Media<span className="text-lime-400">Trend</span>
          </h1>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {error === "invalid" ? (
            <>
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t("Invalid Link", "رابط غير صالح")}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {t(
                  "This verification link is invalid or has already been used.",
                  "هذا الرابط غير صالح أو تم استخدامه مسبقاً."
                )}
              </p>
            </>
          ) : error === "expired" ? (
            <>
              <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t("Link Expired", "رابط منتهي الصلاحية")}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {t(
                  "This verification link has expired. Request a new one below.",
                  "انتهت صلاحية هذا الرابط. اطلب رابطاً جديداً أدناه."
                )}
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-lime-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t("Check your email", "تحقق من بريدك")}
              </h2>
              <p className="text-white/50 text-sm mb-1">
                {t("We sent a verification link to", "أرسلنا رابط التأكيد إلى")}
              </p>
              {email && (
                <p className="text-lime-400 text-sm font-medium mb-6 break-all">{email}</p>
              )}
            </>
          )}

          {/* Resend section */}
          <div className="border-t border-white/[0.06] pt-5">
            {resendStatus === "sent" ? (
              <p className="text-lime-400 text-sm font-medium">
                {t("Sent! Check your inbox.", "تم الإرسال! تحقق من صندوق الوارد.")}
              </p>
            ) : (
              <>
                <p className="text-white/30 text-xs mb-3">
                  {t("Didn't receive the email?", "لم تستلم البريد؟")}
                </p>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resendStatus === "sending" || !email}
                  className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${resendStatus === "sending" ? "animate-spin" : ""}`} />
                  {cooldown > 0
                    ? t(`Resend in ${cooldown}s`, `إعادة الإرسال بعد ${cooldown}ث`)
                    : t("Resend verification email", "إعادة إرسال رابط التأكيد")}
                </button>
                {resendStatus === "error" && (
                  <p className="text-red-400 text-xs mt-2">
                    {t("Failed to send. Try again later.", "فشل الإرسال. حاول لاحقاً.")}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-5">
            <Link href="/login" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              {t("← Back to login", "← العودة لتسجيل الدخول")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Manually test — happy path**

1. Sign up → get redirected to `/verify-email`
2. Verify email display from sessionStorage
3. Click resend — button shows countdown then "تم الإرسال"

- [ ] **Step 3: Manually test — error states**

Visit `/verify-email?error=invalid` — should show red "رابط غير صالح"
Visit `/verify-email?error=expired` — should show amber "رابط منتهي الصلاحية"

---

### Task 10: Update Login Page — Unverified Error Handling

**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Read the current login page to understand its structure**

```bash
cat app/login/page.tsx
```

- [ ] **Step 2: Handle 403 `email_not_verified` error**

Find where the fetch response is handled (the `if (!res.ok)` block) and add a specific branch for `403 email_not_verified`. The exact edit depends on the current structure, but the pattern is:

```ts
if (!res.ok) {
  if (res.status === 403 && data.error === "email_not_verified") {
    // Store email for resend page
    sessionStorage.setItem("mt_pending_email", form.email)
    // Show the unverified error with resend link
    setError("email_not_verified")
  } else {
    setError(data.error || t("Login failed", "فشل تسجيل الدخول"))
  }
  return
}
```

And in the JSX error display, check for the special `"email_not_verified"` error value:

```tsx
{error === "email_not_verified" ? (
  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-400 text-sm text-center">
    {t("Your account is not activated. Check your email or ", "حسابك غير مفعّل. تحقق من بريدك أو ")}
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        })
        sessionStorage.setItem("mt_pending_email", form.email)
        router.push("/verify-email")
      }}
      className="underline hover:text-amber-300 transition-colors"
    >
      {t("resend verification link", "أعد إرسال رابط التأكيد")}
    </button>
  </div>
) : error ? (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
    {error}
  </div>
) : null}
```

- [ ] **Step 3: Test — unverified login shows resend prompt**

1. Ensure `test@example.com` has `email_verified = false`
2. Go to `/login` and submit with test credentials
3. Should see the amber unverified message with resend link
4. Click the link — should navigate to `/verify-email`

---

### Task 11: Add Portal Welcome Banner

**Files:**
- Modify: `app/portal/page.tsx`

The welcome banner was partially implemented in the previous UX session. Verify it matches the spec fully.

- [ ] **Step 1: Read the current portal page welcome banner implementation**

Search for `welcome` in `app/portal/page.tsx`:

```bash
grep -n "welcome\|portal_welcome" app/portal/page.tsx
```

- [ ] **Step 2: Ensure the welcome banner matches the spec**

The welcome banner must:
- Show only when `?welcome=1` in URL AND `localStorage.portal_welcome_dismissed` is NOT set
- Display:
  - AR: "🎉 مرحباً! متجرك التجريبي جاهز. اطلب التفعيل لبدأ البيع الحقيقي."
  - EN: "🎉 Welcome! Your demo store is ready. Request activation to start selling."
- Have a CTA button "اطلب التفعيل الآن" that opens the activation stepper for the first store
- Have a dismiss X button: hides banner + sets `localStorage.setItem('portal_welcome_dismissed', '1')`

If the banner code from the previous UX session covers all these points, no changes needed.
If it's missing any of these behaviors, apply targeted edits to match.

- [ ] **Step 3: Verify in browser**

1. Navigate to `http://localhost:5000/portal?welcome=1` (while logged in)
2. Banner should appear
3. Click X — banner disappears and `localStorage.portal_welcome_dismissed = '1'`
4. Reload — banner does not appear even though `?welcome=1` is in URL
5. Open new incognito window, navigate to `/portal?welcome=1` — banner appears again

---

## Final: Admin Users Fix

### Task 12: Ensure Existing Admin Rows Have email_verified = true

The `email_verified` column defaults to `false`. Existing admin users were created before this migration and will be blocked from logging in unless we fix them.

- [ ] **Step 1: Set email_verified = true for all existing admin users**

```bash
psql $DATABASE_URL -c "UPDATE users SET email_verified = true WHERE role = 'admin';"
```

Expected: `UPDATE N` (where N is the number of admin users).

- [ ] **Step 2: Verify admin login still works**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mediatrend.com","password":"your_admin_password"}'
```

Expected: successful login response.

---

## Environment Variables Checklist

Before going to production, confirm these are set:

| Variable | Scope | Where to set |
|---|---|---|
| `RESEND_API_KEY` | Server-only | `.env.local` / deployment env |
| `NEXT_PUBLIC_APP_URL` | Public | `.env.local` / deployment env |
| `SESSION_SECRET` | Server-only | Already required in production |

> `RESEND_API_KEY` must NOT have `NEXT_PUBLIC_` prefix — it would be exposed to the browser.

---

## Error Handling Summary

| Scenario | Expected Behavior |
|---|---|
| Token not found | Redirect `/verify-email?error=invalid` |
| Token expired | Redirect `/verify-email?error=expired` |
| Already verified | Redirect `/login` |
| Unverified customer login | 403 `email_not_verified`, login page shows resend link |
| Admin login | Unaffected (bypasses check) |
| Resend for unknown email | 200 silently (no enumeration) |
| Resend rate limit hit | 429, UI shows "انتظر قليلاً" |
