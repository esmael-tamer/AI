"use client"

import { MessageSquareText, Eye, LogIn, Rocket } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

export default function HowItWorks() {
  const { t, isAr } = useLang()

  const steps = [
    {
      icon: MessageSquareText,
      num: "01",
      titleEn: "Tell us your idea",
      titleAr: "اكتب أو تكلم بفكرتك",
      descEn: "Type or speak your store concept. Our AI asks up to 8 smart questions to understand your vision.",
      descAr: "اكتب فكرتك أو قلها بصوتك. مساعدنا الذكي يسألك حتى ٨ أسئلة ذكية ليفهم رؤيتك.",
    },
    {
      icon: Eye,
      num: "02",
      titleEn: "Preview a live demo store",
      titleAr: "شوف المتجر التجريبي تفاعلي",
      descEn: "A real interactive store with your branding is generated in minutes — no signup required.",
      descAr: "متجر تفاعلي حقيقي بهويتك التجارية يُنشأ في دقائق — بدون تسجيل.",
    },
    {
      icon: LogIn,
      num: "03",
      titleEn: "Log in and submit",
      titleAr: "سجّل دخولك وكمّل الطلب",
      descEn: "Happy with the demo? Log in, confirm your details, and submit the activation request.",
      descAr: "عجبك الديمو؟ سجّل دخولك، أكّد بياناتك، وأرسل طلب التفعيل.",
    },
    {
      icon: Rocket,
      num: "04",
      titleEn: "We activate everything",
      titleAr: "نفعّل كل شيء لك",
      descEn: "Our team contacts you to activate payments, shipping, warehousing, and fulfillment.",
      descAr: "فريقنا يتواصل معك لتفعيل الدفع والشحن والتخزين والتوصيل.",
    },
  ]

  return (
    <section id="how-it-works" className="py-28 px-4 bg-[#050505] relative overflow-hidden">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-white/35 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Our Workflow", "طريقة عملنا")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("How our platform ", "كيف تجعل منصتنا ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("makes your workflow easier", "عملك أسهل")}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Steps — vertical on mobile, 2-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="group relative flex flex-col h-full rounded-2xl p-7 bg-white/[0.02] border border-white/[0.06] hover:border-lime-400/20 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1">

                {/* Step number */}
                <span className="text-[64px] font-black leading-none text-white/[0.04] group-hover:text-lime-400/[0.07] transition-colors duration-500 select-none mb-4">
                  {step.num}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-lime-400/[0.08] border border-lime-400/10 flex items-center justify-center mb-5 group-hover:bg-lime-400/15 group-hover:border-lime-400/20 transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-lime-400" />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-base mb-2 leading-snug">
                  {isAr ? step.titleAr : step.titleEn}
                </h3>

                {/* Description */}
                <p className="text-white/35 text-sm leading-relaxed flex-1">
                  {isAr ? step.descAr : step.descEn}
                </p>

                {/* Connector arrow (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3.5 z-10 w-7 h-7 rounded-full bg-[#050505] border border-white/[0.08] items-center justify-center">
                    <span className="text-white/20 text-sm">{isAr ? "←" : "→"}</span>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
