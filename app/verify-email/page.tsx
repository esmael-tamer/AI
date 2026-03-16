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
                {t("رابط غير صالح", "Invalid Link")}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {t(
                  "هذا الرابط غير صالح أو تم استخدامه مسبقاً.",
                  "This verification link is invalid or has already been used."
                )}
              </p>
            </>
          ) : error === "expired" ? (
            <>
              <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t("رابط منتهي الصلاحية", "Link Expired")}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {t(
                  "انتهت صلاحية هذا الرابط. اطلب رابطاً جديداً أدناه.",
                  "This verification link has expired. Request a new one below."
                )}
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-lime-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t("تحقق من بريدك", "Check your email")}
              </h2>
              <p className="text-white/50 text-sm mb-1">
                {t("أرسلنا رابط التأكيد إلى", "We sent a verification link to")}
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
                {t("تم الإرسال! تحقق من صندوق الوارد.", "Sent! Check your inbox.")}
              </p>
            ) : (
              <>
                <p className="text-white/30 text-xs mb-3">
                  {t("لم تستلم البريد؟", "Didn't receive the email?")}
                </p>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resendStatus === "sending" || !email}
                  className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${resendStatus === "sending" ? "animate-spin" : ""}`} />
                  {cooldown > 0
                    ? t(`إعادة الإرسال بعد ${cooldown}ث`, `Resend in ${cooldown}s`)
                    : t("إعادة إرسال رابط التأكيد", "Resend verification email")}
                </button>
                {resendStatus === "error" && (
                  <p className="text-red-400 text-xs mt-2">
                    {t("فشل الإرسال. حاول لاحقاً.", "Failed to send. Try again later.")}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-5">
            <Link href="/login" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              {t("← العودة لتسجيل الدخول", "← Back to login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
