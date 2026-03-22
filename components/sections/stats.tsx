"use client"

import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

const STATS = [
  {
    value: "500+",
    labelEn: "Stores Built",
    labelAr: "متجر تم بناؤه",
    descEn: "AI-generated demo stores created for merchants across the MENA region.",
    descAr: "متجر تجريبي أنشأه الذكاء الاصطناعي لتجار في منطقة الشرق الأوسط.",
  },
  {
    value: "35%",
    labelEn: "Average Sales Increase",
    labelAr: "متوسط زيادة المبيعات",
    descEn: "Merchants report higher conversion rates compared to their previous platforms.",
    descAr: "يُفيد التجار بمعدلات تحويل أعلى مقارنةً بمنصاتهم السابقة.",
  },
  {
    value: "0%",
    labelEn: "Monthly Fees",
    labelAr: "رسوم شهرية",
    descEn: "No subscriptions, no hidden costs. Commission only after your first sale.",
    descAr: "بدون اشتراكات أو رسوم خفية. عمولة فقط بعد أول عملية بيع.",
  },
]

export default function Stats() {
  const { t, isAr } = useLang()

  return (
    <section className="py-28 px-4 bg-[#050505] relative overflow-hidden">
      {/* Subtle top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        <ScrollReveal>
          <div className={`text-center mb-20 ${isAr ? "text-right sm:text-center" : ""}`}>
            <span className="inline-block px-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-white/35 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Our Statistics", "إحصاءاتنا")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("The numbers that ", "الأرقام التي ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("define our success", "تعرّفنا")}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.value} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="group bg-[#050505] p-10 hover:bg-white/[0.02] transition-colors duration-500 h-full flex flex-col">
                <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-lime-400 to-emerald-400 mb-3">
                  {stat.value}
                </p>
                <p className="text-white font-semibold text-lg mb-3">
                  {isAr ? stat.labelAr : stat.labelEn}
                </p>
                <p className="text-white/30 text-sm leading-relaxed flex-1">
                  {isAr ? stat.descAr : stat.descEn}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
