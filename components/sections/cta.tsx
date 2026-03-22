"use client"

import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

export default function MTCTA() {
  const { t, isAr } = useLang()

  return (
    <section className="py-28 px-4 bg-[#050505] relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <ScrollReveal variant="scale">
        <div className="max-w-3xl mx-auto text-center relative">

          {/* Central glow */}
          <div className="absolute -inset-20 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]"
              style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.10) 0%, transparent 70%)" }} />
          </div>

          <div className="relative">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
              {t("Ready to transform ", "جاهز لتحويل ")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-300">
                {t("your business?", "تجارتك؟")}
              </span>
            </h2>

            <p className="mt-7 text-white/35 text-lg max-w-lg mx-auto leading-relaxed">
              {t(
                "Start with a free demo store, then activate when you're ready. No subscriptions, commission only.",
                "ابدأ بمتجر تجريبي مجاني، ثم فعّل عندما تكون جاهزاً. بدون اشتراكات، عمولة فقط."
              )}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/builder"
                className="group flex items-center gap-2.5 px-9 py-4 bg-lime-400 text-black font-bold text-base rounded-full hover:bg-lime-300 transition-all hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(163,230,53,0.30)]"
              >
                {t("Get started free", "ابدأ مجانًا")}
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-0.5" : ""}`} />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9656566179840"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-8 py-4 text-white/60 font-medium text-base rounded-full border border-white/10 hover:bg-white/[0.05] hover:border-white/20 hover:text-white/80 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                {t("WhatsApp Us", "تواصل واتساب")}
              </a>
            </div>

            <p className="mt-6 text-xs text-white/20">
              {t("No credit card required · Commission only after activation", "بدون بطاقة ائتمان · عمولة فقط بعد التفعيل")}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
