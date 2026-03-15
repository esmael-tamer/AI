"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";

export default function SignupPage() {
  const router = useRouter();
  const { t, isAr } = useLang();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name_ar: "",
    name_en: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sessionId = localStorage.getItem("mt_session_id") || undefined;
      const storeSlug = localStorage.getItem("mt_store_slug") || undefined;

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, session_id: sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("Signup failed", "فشل إنشاء الحساب"));
        return;
      }

      // Clear saved session after linking
      localStorage.removeItem("mt_session_id");
      localStorage.removeItem("mt_store_slug");

      // If they came from building a demo store, show them their store first
      if (storeSlug) {
        router.push(`/portal?linked=${storeSlug}`);
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              Media<span className="text-lime-400">Trend</span>
            </h1>
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">{t("Create your account", "أنشئ حسابك")}</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name_ar" className="text-zinc-300 text-sm">
                  {t("Name (Arabic)", "الاسم (عربي)")}
                </Label>
                <Input
                  id="name_ar"
                  value={form.name_ar}
                  onChange={(e) =>
                    setForm({ ...form, name_ar: e.target.value })
                  }
                  placeholder="الاسم"
                  dir="rtl"
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name_en" className="text-zinc-300 text-sm">
                  {t("Name (English)", "الاسم (إنجليزي)")}
                </Label>
                <Input
                  id="name_en"
                  value={form.name_en}
                  onChange={(e) =>
                    setForm({ ...form, name_en: e.target.value })
                  }
                  placeholder="Name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
                />
              </div>
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
                placeholder="+966 5XX XXX XXXX"
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
              <Link
                href="/login"
                className="text-lime-400 hover:text-lime-300 transition-colors"
              >
                {t("Sign In", "تسجيل الدخول")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
