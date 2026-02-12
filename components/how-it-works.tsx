"use client"

import { MessageSquareText, Eye, LogIn, Rocket } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/scroll-reveal"

export default function HowItWorks() {
  const { t } = useLang()

  const steps = [
    {
      icon: MessageSquareText,
      num: "01",
      title: t("Tell us your idea (text/voice)", "اكتب/تكلم بفكرتك"),
    },
    {
      icon: Eye,
      num: "02",
      title: t("Preview a live demo store", "شوف المتجر التجريبي تفاعلي"),
    },
    {
      icon: LogIn,
      num: "03",
      title: t("Log in and complete your request", "سجّل دخولك وكمّل بيانات الطلب"),
    },
    {
      icon: Rocket,
      num: "04",
      title: t(
        "We contact you to activate payments, shipping, and fulfillment",
        "يوصلنا الطلب ونكلمك لتفعيل الدفع والشحن والتخزين"
      ),
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
              {t("How It Works", "كيف يعمل")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("From idea to ", "من الفكرة ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("live store", "لمتجر حي")}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i + 1 as 1 | 2 | 3 | 4}>
              <div
                className="group relative rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-lime-400/20 transition-all duration-500 hover:-translate-y-1 h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                    <step.icon className="w-5 h-5 text-lime-400" />
                  </div>
                  <span className="text-2xl font-black text-white/10 group-hover:text-lime-400/20 transition-colors">{step.num}</span>
                </div>
                <p className="text-sm font-medium text-white/70 leading-relaxed">{step.title}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-center text-white/10">→</div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
