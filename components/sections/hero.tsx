"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, MessageCircle, ShoppingBag, Star, Package, CreditCard, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useLang } from "@/lib/i18n"

export default function MTHero() {
  const { t, isAr } = useLang()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-0 bg-[#050505] overflow-hidden">

      {/* ── Central glow orb (Visuo-style) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main central orb */}
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,230,53,0.18) 0%, rgba(52,211,153,0.08) 40%, transparent 70%)" }} />
        {/* Elongated vertical beam */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(163,230,53,0.08) 30%, rgba(163,230,53,0.15) 50%, rgba(163,230,53,0.06) 70%, transparent)" }} />
        {/* Secondary halo */}
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,230,53,0.06) 0%, transparent 60%)" }} />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto w-full text-center flex flex-col items-center">

        {/* Badge */}
        <div className={`transition-all duration-600 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-10">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-white/60 text-sm font-medium">
              {t("AI-Powered E-commerce Platform", "منصة تجارة إلكترونية بالذكاء الاصطناعي")}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] transition-all duration-700 delay-100 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {isAr ? (
            <>
              <span className="block">ابنِ متجرك</span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-300">
                بالذكاء الاصطناعي
              </span>
            </>
          ) : (
            <>
              <span className="block">Build your store</span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-300">
                with AI
              </span>
            </>
          )}
        </h1>

        {/* Subheadline */}
        <p className={`mt-7 text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {t(
            "Generate a live interactive store demo in minutes. No subscriptions — commission on sales only after activation.",
            "جهّز متجرك التجريبي التفاعلي في دقائق. بدون اشتراكات — عمولة على المبيعات فقط بعد التفعيل."
          )}
        </p>

        {/* CTAs */}
        <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <button
            onClick={() => router.push("/builder")}
            className="group flex items-center gap-2.5 px-8 py-3.5 bg-lime-400 text-black font-bold text-base rounded-full hover:bg-lime-300 transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(163,230,53,0.35)]"
          >
            {t("Get started free", "ابدأ مجانًا")}
            <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-0.5" : ""}`} />
          </button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9656566179840"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-8 py-3.5 text-white/60 font-medium text-base rounded-full border border-white/10 hover:bg-white/[0.05] hover:border-white/20 hover:text-white/80 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-green-400" />
            {t("Talk to our team", "تكلم مع فريقنا")}
          </a>
        </div>

        {/* No-fee note */}
        <p className={`mt-5 text-xs text-white/20 transition-all duration-700 delay-[400ms] ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
          {t("No credit card required · Commission only after activation", "بدون بطاقة ائتمان · عمولة فقط بعد التفعيل")}
        </p>
      </div>

      {/* ── Store Mockup (Visuo dashboard-style) ── */}
      <div className={`relative w-full max-w-5xl mx-auto mt-16 transition-all duration-1000 delay-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        {/* Fade overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
        {/* Side fade overlays */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        {/* The mockup card */}
        <div className="rounded-t-2xl border border-white/[0.08] bg-[#0e0e0e] overflow-hidden shadow-[0_-8px_60px_rgba(163,230,53,0.07)]">
          {/* Window bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0a]">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-lime-400/40" />
            <div className="flex-1 mx-4">
              <div className="mx-auto w-48 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="text-white/20 text-xs">mediatrend.store/my-store</span>
              </div>
            </div>
          </div>

          {/* Store content */}
          <div className="p-6 grid grid-cols-12 gap-4 min-h-[320px]">
            {/* Sidebar */}
            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-lime-400/10 border border-lime-400/15">
                <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-lime-400 text-xs font-medium">{t("Store", "المتجر")}</span>
              </div>
              {[Package, CreditCard, TrendingUp, Star].map((Icon, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer">
                  <Icon className="w-3.5 h-3.5 text-white/20" />
                  <div className="h-2 rounded bg-white/[0.06]" style={{ width: `${40 + i * 10}%` }} />
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="col-span-10 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t("Revenue", "الإيرادات"), value: "KD 4,820", color: "lime" },
                  { label: t("Orders", "الطلبات"), value: "148", color: "emerald" },
                  { label: t("Products", "المنتجات"), value: "32", color: "white" },
                  { label: t("Visitors", "الزوار"), value: "1,204", color: "white" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-white/30 text-xs mb-1">{stat.label}</p>
                    <p className={`text-base font-bold ${stat.color === "lime" ? "text-lime-400" : stat.color === "emerald" ? "text-emerald-400" : "text-white"}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: isAr ? "عطر خيال" : "Khayal Perfume", price: "KD 28", tag: t("Best seller", "الأكثر مبيعاً"), color: "#c9a84c" },
                  { name: isAr ? "فستان أناقة" : "Elegance Dress", price: "KD 45", tag: t("New", "جديد"), color: "#ec4899" },
                  { name: isAr ? "سيروم غلو" : "Glow Serum", price: "KD 18", tag: t("Sale", "تخفيض"), color: "#8b5cf6" },
                ].map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <div className="h-24 flex items-center justify-center" style={{ background: `${p.color}12` }}>
                      <div className="w-10 h-10 rounded-full" style={{ background: `${p.color}30`, border: `1px solid ${p.color}40` }} />
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-white/70 text-xs font-medium leading-tight">{p.name}</p>
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full text-black font-semibold" style={{ backgroundColor: p.color + "cc" }}>{p.tag}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-1">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
