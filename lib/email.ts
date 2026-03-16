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
