"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function MTCTA() {
  const { t, isAr } = useLang()

  return (
    <section className="py-28 px-4 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl p-12 sm:p-20 overflow-hidden border border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-emerald-400/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime-400/[0.08] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/[0.06] rounded-full blur-[100px] pointer-events-none" />

          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(rgba(163, 230, 53, 0.04) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-lime-400 text-xs font-medium">
                {t("No credit card required", "بدون بطاقة ائتمان")}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {t("Ready to Transform", "جاهز لتحويل")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("Your Business?", "عملك؟")}
              </span>
            </h2>
            <p className="mt-5 text-lg text-white/30 max-w-lg mx-auto leading-relaxed">
              {t(
                "Join thousands of entrepreneurs who launched their stores with Media Trend. Start free, pay only when you sell.",
                "انضم لآلاف رواد الأعمال الذين أطلقوا متاجرهم مع ميديا تريند. ابدأ مجاناً، وادفع فقط عندما تبيع."
              )}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="group flex items-center gap-2 px-10 py-4 bg-lime-400 text-black font-bold text-lg rounded-full hover:bg-lime-300 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.3)]"
              >
                {t("Start Your Free Store", "ابدأ متجرك المجاني")}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 text-white font-medium text-lg rounded-full border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all"
              >
                {t("Talk to Sales", "تواصل مع المبيعات")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
