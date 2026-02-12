"use client"

import Link from "next/link";
import MTHeader from "@/components/mt-header";
import MTFooter from "@/components/mt-footer";
import {
  Store,
  Palette,
  BarChart3,
  Headphones,
  ArrowRight,
  Megaphone,
  Users,
} from "lucide-react";

const services = [
  {
    icon: Store,
    title: "AI Store Builder",
    titleAr: "بناء المتاجر بالذكاء الاصطناعي",
    description:
      "Create your complete online store in minutes through a guided AI conversation. No coding, no design skills needed.",
    features: [
      "Smart product categorization",
      "Auto-generated branding",
      "WhatsApp integration",
      "Multiple payment options",
    ],
    href: "/builder",
    color: "from-lime-400/20 to-emerald-400/10",
  },
  {
    icon: Megaphone,
    title: "Ad Campaign Management",
    titleAr: "إدارة الحملات الإعلانية",
    description:
      "High-performing ad campaigns on Google, Meta, TikTok, and Snapchat designed to drive traffic and revenue.",
    features: [
      "Multi-platform campaigns",
      "Creative design",
      "Budget optimization",
      "Performance tracking",
    ],
    href: "/services/ad-campaigns",
    color: "from-blue-400/20 to-cyan-400/10",
  },
  {
    icon: Users,
    title: "Account Management",
    titleAr: "إدارة الحسابات",
    description:
      "Full management of your e-commerce operations — inventory, customer service, order processing, and analytics.",
    features: [
      "Inventory management",
      "Order processing",
      "Customer service",
      "Financial reports",
    ],
    href: "/services/account-management",
    color: "from-purple-400/20 to-pink-400/10",
  },
  {
    icon: Palette,
    title: "Store Design & Customization",
    titleAr: "تصميم وتخصيص المتاجر",
    description:
      "Premium custom designs that match your brand. Unique shopping experiences that convert visitors into customers.",
    features: [
      "Custom theme development",
      "Brand identity integration",
      "Mobile-first design",
      "A/B testing ready",
    ],
    href: "/contact",
    color: "from-orange-400/20 to-amber-400/10",
  },
  {
    icon: BarChart3,
    title: "Growth & Marketing",
    titleAr: "النمو والتسويق",
    description:
      "Data-driven marketing strategies to grow your online presence. SEO, social media, and performance marketing.",
    features: [
      "SEO optimization",
      "Social media management",
      "Google & Meta ads",
      "Analytics dashboard",
    ],
    href: "/contact",
    color: "from-teal-400/20 to-green-400/10",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    titleAr: "دعم مخصص",
    description:
      "24/7 support in Arabic and English. Our team is always ready to help you succeed with your online business.",
    features: [
      "Arabic & English support",
      "24/7 availability",
      "Priority ticket system",
      "Dedicated account manager",
    ],
    href: "/contact",
    color: "from-rose-400/20 to-red-400/10",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-5 py-2 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-8 backdrop-blur-sm">
            Our Services / خدماتنا
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              succeed online
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            From AI-powered store creation to growth marketing, we provide
            end-to-end solutions for your e-commerce journey.
          </p>
          <p className="text-zinc-600 text-base mt-2" dir="rtl">
            من بناء المتاجر بالذكاء الاصطناعي إلى التسويق — حلول شاملة لرحلتك في التجارة الإلكترونية
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
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
                <h3 className="text-xl font-bold text-white mb-1">
                  {service.title}
                </h3>
                <p className="text-zinc-600 text-sm mb-3" dir="rtl">
                  {service.titleAr}
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-zinc-500 text-sm flex items-center gap-2.5"
                    >
                      <div className="w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-lime-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-lime-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Ready to start?
              </h2>
              <p className="text-zinc-400 mb-8 text-lg">
                Talk to our team or try the AI builder now
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/builder"
                  className="group inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(163,230,53,0.3)]"
                >
                  Try AI Builder
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-4 rounded-full transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MTFooter />
    </div>
  );
}
