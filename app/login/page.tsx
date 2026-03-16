"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t, isAr } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error === "email_not_verified") {
          sessionStorage.setItem("mt_pending_email", email)
          setError("email_not_verified")
        } else {
          setError(data.error || t("فشل تسجيل الدخول", "Login failed"))
        }
        return;
      }

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
    } catch {
      setError(t("Something went wrong", "حدث خطأ ما"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-400/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              Media<span className="text-lime-400">Trend</span>
            </h1>
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">{t("Sign in to your account", "سجّل دخولك")}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error === "email_not_verified" ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-400 text-sm text-center">
                {t("حسابك غير مفعّل. تحقق من بريدك أو ", "Your account is not activated. Check your email or ")}
                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/auth/resend-verification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    })
                    sessionStorage.setItem("mt_pending_email", email)
                    router.push("/verify-email")
                  }}
                  className="underline hover:text-amber-300 transition-colors"
                >
                  {t("أعد إرسال رابط التأكيد", "resend verification link")}
                </button>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">
                {t("Email", "البريد الإلكتروني")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-lime-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-zinc-300 text-sm">
                {t("Password", "كلمة المرور")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Enter your password", "أدخل كلمة المرور")}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-lime-400/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-300 text-black font-semibold h-11 rounded-xl transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {t("Signing in...", "جاري الدخول...")}
                </span>
              ) : (
                t("Sign In", "تسجيل الدخول")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              {t("Don't have an account? ", "ليس لديك حساب؟ ")}
              <Link
                href="/signup"
                className="text-lime-400 hover:text-lime-300 transition-colors"
              >
                {t("Sign Up", "إنشاء حساب")}
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
