"use client"

import Link from "next/link"
import { Check, ArrowRight, Sparkles } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/scroll-reveal"

export function Pricing() {
  const { t, isAr } = useLang()

  const plans = [
    {
      name: t("Launch — 5% Commission", "إطلاق — عمولة ٥٪"),
      rate: "5%",
      description: t(
        "Full store activation + core setup",
        "تفعيل شامل للمتجر + تجهيز الربط الأساسي"
      ),
      features: [
        t("Store + activation", "المتجر + التفعيل"),
        t("Shipping integration", "تكامل الشحن"),
        t("Warehousing / fulfillment", "خدمة التخزين"),
        t("Custom domain", "نطاق مخصص"),
        t("Priority support", "دعم أولوية"),
      ],
      cta: t("Continue to activate", "كمّل الطلب للتفعيل"),
      highlight: false,
      href: "/portal",
    },
    {
      name: t("Growth — 10% Commission", "نمو — عمولة ١٠٪"),
      rate: "10%",
      description: t(
        "Everything in 5% + deeper tracking",
        "كل مزايا ٥٪ + أدوات متابعة أقوى"
      ),
      features: [
        t("Everything in the 5% plan", "كل ما في باقة ٥٪"),
        t("Advanced analytics", "تحليلات متقدمة"),
        t("WhatsApp integration", "تكامل واتساب"),
      ],
      cta: t("Continue to activate", "كمّل الطلب للتفعيل"),
      highlight: true,
      badge: t("Popular", "الأكثر طلباً"),
      href: "/portal",
    },
    {
      name: t("Managed — 25% Commission", "إدارة شاملة — عمولة ٢٥٪"),
      rate: "25%",
      description: t(
        "We run operations & growth end-to-end",
        "نحن ندير التشغيل والنمو بالكامل"
      ),
      features: [
        t("All Launch benefits", "كل مزايا الإطلاق"),
        t("Dedicated account manager", "مدير حساب مخصص"),
        t("Ad campaign management", "إدارة الحملات الإعلانية"),
        t("Full store operations", "عمليات متجر كاملة"),
        t("Inventory management", "إدارة المخزون"),
        t("Customer support team", "فريق خدمة عملاء"),
        t("Growth strategy", "استراتيجية نمو"),
      ],
      cta: t("Request managed setup", "اطلب إدارة شاملة"),
      highlight: false,
      href: "/contact",
    },
  ]

  return (
    <section id="pricing" className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-400/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Pricing", "الأسعار")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("Commission Plans — ", "باقات العمولة — ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("No Subscriptions", "بدون اشتراكات")}
              </span>
            </h2>
            <p className="mt-4 text-lg text-white/30 max-w-2xl mx-auto">
              {t(
                "Everyone can generate a free demo store. When you're ready to go live, choose an activation plan and we'll set up the integrations.",
                "المتجر التجريبي متاح للجميع. بعد ما يعجبك المتجر، اختر باقة التفعيل المناسبة ونبدأ الربط والتجهيز."
              )}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i + 1 as 1 | 2 | 3}>
              <div
                className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 h-full ${
                  plan.highlight
                    ? "bg-gradient-to-b from-lime-400/[0.08] to-transparent border-lime-400/20 shadow-[0_0_50px_rgba(163,230,53,0.08)] scale-[1.02]"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
                } border`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-lime-400 to-emerald-400 text-black text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-3">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white">{plan.rate}</span>
                    <span className="text-white/30 text-sm mb-2">{t("commission", "عمولة")}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/30 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-lime-400/20" : "bg-white/5"}`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-lime-400" : "text-white/40"}`} />
                      </div>
                      <span className="text-sm text-white/50">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-lime-400 text-black hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                      : "border border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="mt-8 text-center text-xs text-white/20 max-w-2xl mx-auto">
            {t(
              "Commission applies after activation and on real sales. We review your request and contact you to complete setup.",
              "العمولة تُطبق بعد تفعيل المتجر وعلى المبيعات الفعلية. نراجع طلبك ونتواصل معك لإكمال الربط."
            )}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
