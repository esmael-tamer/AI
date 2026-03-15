"use client"

import Link from "next/link"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import {
  Store,
  Palette,
  BarChart3,
  Headphones,
  ArrowRight,
  Megaphone,
  Users,
} from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function ServicesPage() {
  const { t, isAr } = useLang()

  const services = [
    {
      icon: Store,
      title: t("AI Store Builder", "بناء المتاجر بالذكاء الاصطناعي"),
      description: t(
        "Create your complete online store in minutes through a guided AI conversation. No coding, no design skills needed.",
        "أنشئ متجرك الإلكتروني الكامل في دقائق عبر محادثة ذكية موجّهة. بدون برمجة أو تصميم."
      ),
      features: [
        t("Smart product categorization", "تصنيف ذكي للمنتجات"),
        t("Auto-generated branding", "هوية بصرية تلقائية"),
        t("WhatsApp integration", "تكامل واتساب"),
        t("Multiple payment options", "خيارات دفع متعددة"),
      ],
      href: "/builder",
      color: "from-lime-400/20 to-emerald-400/10",
    },
    {
      icon: Megaphone,
      title: t("Ad Campaign Management", "إدارة الحملات الإعلانية"),
      description: t(
        "High-performing ad campaigns on Google, Meta, TikTok, and Snapchat designed to drive traffic and revenue.",
        "حملات إعلانية عالية الأداء على Google وMeta وTikTok وSnapchat مصممة لزيادة الزيارات والإيرادات."
      ),
      features: [
        t("Multi-platform campaigns", "حملات متعددة المنصات"),
        t("Creative design", "تصميم إبداعي"),
        t("Budget optimization", "تحسين الميزانية"),
        t("Performance tracking", "تتبع الأداء"),
      ],
      href: "/services/ad-campaigns",
      color: "from-blue-400/20 to-cyan-400/10",
    },
    {
      icon: Users,
      title: t("Account Management", "إدارة الحسابات"),
      description: t(
        "Full management of your e-commerce operations — inventory, customer service, order processing, and analytics.",
        "إدارة كاملة لعمليات متجرك — المخزون وخدمة العملاء ومعالجة الطلبات والتحليلات."
      ),
      features: [
        t("Inventory management", "إدارة المخزون"),
        t("Order processing", "معالجة الطلبات"),
        t("Customer service", "خدمة العملاء"),
        t("Financial reports", "التقارير المالية"),
      ],
      href: "/services/account-management",
      color: "from-purple-400/20 to-pink-400/10",
    },
    {
      icon: Palette,
      title: t("Store Design & Customization", "تصميم وتخصيص المتاجر"),
      description: t(
        "Premium custom designs that match your brand. Unique shopping experiences that convert visitors into customers.",
        "تصاميم مخصصة متميزة تتناسب مع علامتك التجارية. تجارب تسوّق فريدة تحوّل الزوار لعملاء."
      ),
      features: [
        t("Custom theme development", "تطوير قوالب مخصصة"),
        t("Brand identity integration", "دمج الهوية التجارية"),
        t("Mobile-first design", "تصميم للجوال أولاً"),
        t("A/B testing ready", "جاهز لاختبارات A/B"),
      ],
      href: "/contact",
      color: "from-orange-400/20 to-amber-400/10",
    },
    {
      icon: BarChart3,
      title: t("Growth & Marketing", "النمو والتسويق"),
      description: t(
        "Data-driven marketing strategies to grow your online presence. SEO, social media, and performance marketing.",
        "استراتيجيات تسويقية مبنية على البيانات. تحسين محركات البحث والتواصل الاجتماعي والتسويق بالأداء."
      ),
      features: [
        t("SEO optimization", "تحسين محركات البحث"),
        t("Social media management", "إدارة التواصل الاجتماعي"),
        t("Google & Meta ads", "إعلانات Google و Meta"),
        t("Analytics dashboard", "لوحة تحليلات"),
      ],
      href: "/contact",
      color: "from-teal-400/20 to-green-400/10",
    },
    {
      icon: Headphones,
      title: t("Dedicated Support", "دعم مخصص"),
      description: t(
        "24/7 support in Arabic and English. Our team is always ready to help you succeed with your online business.",
        "دعم على مدار الساعة بالعربية والإنجليزية. فريقنا دائماً جاهز لمساعدتك في نجاح عملك."
      ),
      features: [
        t("Arabic & English support", "دعم عربي وإنجليزي"),
        t("24/7 availability", "متاح 24/7"),
        t("Priority ticket system", "نظام تذاكر أولوية"),
        t("Dedicated account manager", "مدير حساب مخصص"),
      ],
      href: "/contact",
      color: "from-rose-400/20 to-red-400/10",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-5 py-2 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-8 backdrop-blur-sm">
            {t("Our Services", "خدماتنا")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            {t("Everything you need to ", "كل ما تحتاجه ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              {t("succeed online", "للنجاح أونلاين")}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {t(
              "From AI-powered store creation to growth marketing, we provide end-to-end solutions for your e-commerce journey.",
              "من بناء المتاجر بالذكاء الاصطناعي إلى تسويق النمو، نقدم حلولاً شاملة لرحلتك في التجارة الإلكترونية."
            )}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 hover:border-lime-400/30 transition-all duration-500 hover:bg-white/[0.06] hover:-translate-y-1"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="w-14 h-14 bg-white/[0.06] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                  <service.icon className="w-7 h-7 text-lime-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-zinc-500 text-sm flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-lime-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t("Learn more", "اعرف المزيد")}
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 sm:p-16 text-center overflow-hidden border border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-emerald-400/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {t("Ready to start?", "جاهز للبدء؟")}
              </h2>
              <p className="text-zinc-400 mb-8 text-lg">
                {t("Talk to our team or try the AI builder now", "تحدث مع فريقنا أو جرّب البناء الذكي الآن")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/builder"
                  className="group inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
                >
                  {t("Try AI Builder", "جرّب البناء الذكي")}
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-4 rounded-full transition-all"
                >
                  {t("Contact Us", "تواصل معنا")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MTFooter />
    </div>
  )
}
