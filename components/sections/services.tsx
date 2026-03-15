"use client"

import Link from "next/link"
import { Sparkles, Megaphone, Users, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

export default function MTServices() {
  const { t, isAr } = useLang()

  const services = [
    {
      icon: Sparkles,
      title: t("AI Store Builder", "بناء المتاجر بالذكاء الاصطناعي"),
      description: t(
        "Instant interactive demo store — then activate payments, shipping, fulfillment",
        "بناء متجر تجريبي تفاعلي فورًا — ثم تفعيل وربط الدفع والشحن والتخزين"
      ),
      cta: t("Try now", "جرّب الآن"),
      href: "/builder",
      highlight: true,
      gradient: "from-lime-400/20 to-emerald-400/5",
    },
    {
      icon: Megaphone,
      title: t("Ad Campaigns", "إطلاق الحملات الإعلانية"),
      description: t(
        "Launch ad campaigns on all platforms — AI planner then submit request",
        "إطلاق حملات إعلانية على جميع المنصات — جرّب مخطط AI ثم أرسل الطلب"
      ),
      cta: t("Create brief", "أنشئ ملخصاً"),
      href: "/services/ad-campaigns",
      highlight: false,
      gradient: "from-purple-400/10 to-pink-400/5",
    },
    {
      icon: Users,
      title: t("Account Management", "إدارة الحسابات"),
      description: t(
        "Account management & content — AI plan then team follow-up",
        "إدارة الحسابات وصناعة المحتوى — خطة AI ثم متابعة من فريقنا"
      ),
      cta: t("Create brief", "أنشئ ملخصاً"),
      href: "/services/account-management",
      highlight: false,
      gradient: "from-blue-400/10 to-cyan-400/5",
    },
  ]

  return (
    <section id="services" className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Our Services", "خدماتنا")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("Everything You Need to ", "كل ما تحتاجه ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("Succeed", "للنجاح")}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i + 1 as 1 | 2 | 3}>
              <div
                className={`group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 bg-white/[0.02] border h-full ${
                  service.highlight
                    ? "border-lime-400/20 shadow-[0_0_40px_rgba(163,230,53,0.08)]"
                    : "border-white/[0.06] hover:border-white/10"
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                      service.highlight ? "bg-lime-400/15" : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    }`}
                  >
                    <service.icon
                      className={`w-6 h-6 ${
                        service.highlight ? "text-lime-400" : "text-white/40 group-hover:text-white/70"
                      } transition-colors`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed mb-6">{service.description}</p>
                  <Link
                    href={service.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${
                      service.highlight ? "text-lime-400 hover:text-lime-300" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {service.cta}
                    <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
