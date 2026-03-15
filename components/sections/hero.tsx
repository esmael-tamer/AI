"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, Mic, Send, MessageCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useLang } from "@/lib/i18n"

export default function MTHero() {
  const { t, isAr } = useLang()
  const router = useRouter()
  const [idea, setIdea] = useState("")
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault()
    router.push("/builder")
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-20 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-lime-400/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-400/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-400/[0.03] rounded-full blur-[200px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(rgba(163, 230, 53, 0.06) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-5xl mx-auto text-center relative">
        <div className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/20 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span className="text-lime-400 text-sm font-medium">
              {t("AI-Powered Platform", "منصة مدعومة بالذكاء الاصطناعي")}
            </span>
          </div>
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight transition-all duration-700 delay-150 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {isAr ? (
            <>
              <span className="block">ابنِ متجرك الإلكتروني</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-300">بالذكاء الاصطناعي</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-white/80">…وشوفه قدامك خلال دقائق</span>
            </>
          ) : (
            <>
              <span className="block">Build your ecommerce store</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-300">with AI</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-white/80">— see a live demo in minutes</span>
            </>
          )}
        </h1>

        <p className={`mt-6 text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {t(
            "Type or speak your idea. Our AI generates an interactive demo store with no signup. If you like it, log in and submit your request so our team can activate payments, shipping, and fulfillment.",
            "اكتب أو تكلم بفكرتك، ومساعدنا الذكي يجهّز لك متجر تجريبي تفاعلي بدون تسجيل. لو عجبك، سجّل دخولك وكمّل الطلب عشان يوصلنا ونفعّل لك الدفع والشحن والتخزين."
          )}
        </p>

        <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] transition-all duration-700 delay-[400ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs sm:text-sm text-lime-400/70 font-medium">
            {t(
              "No subscriptions — commission on sales only (after activation)",
              "بدون اشتراكات — عمولة على المبيعات فقط بعد التفعيل"
            )}
          </span>
        </div>

        <form onSubmit={handleGenerate} className={`mt-10 max-w-2xl mx-auto transition-all duration-700 delay-500 ease-out ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
          <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl hover:border-white/15 transition-all focus-within:border-lime-400/30">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={t(
                "Example: Perfume store for Kuwait, fast delivery, local payments",
                "مثال: أبي متجر عطور في الكويت + توصيل سريع + دفع محلي"
              )}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 focus:outline-none py-1"
              dir={isAr ? "rtl" : "ltr"}
            />
            <button
              type="button"
              className="p-2.5 rounded-xl bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title={t("Voice input", "إدخال صوتي")}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black font-semibold text-sm hover:bg-lime-300 transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
            >
              <Send className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              {t("Generate", "ابدأ")}
            </button>
          </div>
          <p className="mt-3 text-xs text-white/25">
            {t(
              "Up to 8 quick questions, then we generate your demo store.",
              "حتى ٨ أسئلة قصيرة ثم نعرض المتجر التجريبي."
            )}
          </p>
        </form>

        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-[600ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button
            onClick={() => router.push("/builder")}
            className="group flex items-center gap-2 px-8 py-3.5 bg-lime-400 text-black font-bold text-base rounded-full hover:bg-lime-300 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.3)]"
          >
            {t("Start building for free", "ابدأ البناء مجانًا")}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9656566179840"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 text-white/60 font-medium text-sm rounded-full border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-green-400" />
            {t("Talk to our team", "تكلم مع فريقنا")}
          </a>
        </div>

        {/* Stats bar */}
        <div className={`mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.06] transition-all duration-700 delay-[700ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { value: "500+", labelEn: "Stores built", labelAr: "متجر تم بناؤه" },
            { value: "8", labelEn: "MENA countries", labelAr: "دول خليجية" },
            { value: "< 3 min", labelEn: "Average build time", labelAr: "وقت البناء" },
            { value: "0%", labelEn: "Monthly fees", labelAr: "رسوم شهرية" },
          ].map((stat) => (
            <div key={stat.value} className="bg-[#0a0a0a] px-6 py-5 text-center">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{isAr ? stat.labelAr : stat.labelEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
