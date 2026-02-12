"use client"

import Link from "next/link"
import { Sparkles, Server, CreditCard, BarChart3, HeadphonesIcon, Shield, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function MTServices() {
  const { t } = useLang()

  const services = [
    {
      icon: Sparkles,
      title: t("AI Store Builder", "بناء المتاجر بالذكاء الاصطناعي"),
      description: t(
        "Create your complete store with our intelligent assistant. Answer a few questions and get a fully functional storefront.",
        "أنشئ متجرك الكامل مع مساعدنا الذكي. أجب عن بعض الأسئلة واحصل على واجهة متجر فعالة."
      ),
      highlight: true,
      gradient: "from-lime-400/20 to-emerald-400/5",
    },
    {
      icon: Server,
      title: t("Premium Hosting", "استضافة متميزة"),
      description: t(
        "Lightning-fast servers with 99.9% uptime guarantee. Your store is always online and blazing fast.",
        "خوادم فائقة السرعة مع ضمان تشغيل 99.9%. متجرك دائماً متاح وسريع."
      ),
      highlight: false,
      gradient: "from-blue-400/10 to-cyan-400/5",
    },
    {
      icon: CreditCard,
      title: t("Payment Integration", "تكامل الدفع"),
      description: t(
        "Accept payments globally with multi-currency support. Stripe, PayPal, Apple Pay, and local payment methods.",
        "اقبل المدفوعات عالمياً مع دعم العملات المتعددة. Stripe، PayPal، Apple Pay، وطرق الدفع المحلية."
      ),
      highlight: false,
      gradient: "from-purple-400/10 to-pink-400/5",
    },
    {
      icon: BarChart3,
      title: t("Smart Analytics", "تحليلات ذكية"),
      description: t(
        "Data-driven insights to grow your business. Track visitors, conversions, revenue, and customer behavior.",
        "رؤى مبنية على البيانات لتنمية عملك. تتبع الزوار والتحويلات والإيرادات وسلوك العملاء."
      ),
      highlight: false,
      gradient: "from-orange-400/10 to-amber-400/5",
    },
    {
      icon: HeadphonesIcon,
      title: t("24/7 Support", "دعم على مدار الساعة"),
      description: t(
        "Expert help whenever you need it. Our support team is available around the clock via chat, email, and phone.",
        "مساعدة متخصصة في أي وقت. فريق الدعم متاح على مدار الساعة عبر المحادثة والبريد والهاتف."
      ),
      highlight: false,
      gradient: "from-teal-400/10 to-green-400/5",
    },
    {
      icon: Shield,
      title: t("Enterprise Security", "أمان متقدم"),
      description: t(
        "Bank-grade security for your store and customers. SSL encryption, PCI compliance, and fraud protection.",
        "أمان بمستوى البنوك لمتجرك وعملائك. تشفير SSL، توافق PCI، وحماية من الاحتيال."
      ),
      highlight: false,
      gradient: "from-rose-400/10 to-red-400/5",
    },
  ]

  return (
    <section className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
            {t("Our Platform", "منصتنا")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            {t("Everything You Need to ", "كل ما تحتاجه ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              {t("Succeed", "للنجاح")}
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/30 max-w-xl mx-auto">
            {t(
              "Comprehensive e-commerce solutions powered by cutting-edge technology",
              "حلول تجارة إلكترونية شاملة مدعومة بأحدث التقنيات"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.title}
              className={`group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 bg-white/[0.02] border ${
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
                <p className="text-sm text-white/35 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-lime-400 text-sm font-medium hover:gap-3 transition-all"
          >
            {t("View all services", "عرض جميع الخدمات")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
