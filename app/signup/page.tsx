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
  const { t } = useLang()
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
          setError(t("Email already registered", "البريد الإلكتروني مسجّل مسبقاً"))
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
