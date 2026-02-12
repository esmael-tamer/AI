import Link from "next/link"
import { Sparkles, Server, CreditCard, BarChart3, HeadphonesIcon, Shield, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    title: "AI Store Builder",
    titleAr: "بناء المتاجر بالذكاء الاصطناعي",
    description: "Create your complete store with our intelligent assistant. Answer a few questions and get a fully functional storefront.",
    highlight: true,
    gradient: "from-lime-400/20 to-emerald-400/5",
  },
  {
    icon: Server,
    title: "Premium Hosting",
    titleAr: "استضافة متميزة",
    description: "Lightning-fast servers with 99.9% uptime guarantee. Your store is always online and blazing fast.",
    highlight: false,
    gradient: "from-blue-400/10 to-cyan-400/5",
  },
  {
    icon: CreditCard,
    title: "Payment Integration",
    titleAr: "تكامل الدفع",
    description: "Accept payments globally with multi-currency support. Stripe, PayPal, Apple Pay, and local payment methods.",
    highlight: false,
    gradient: "from-purple-400/10 to-pink-400/5",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    titleAr: "تحليلات ذكية",
    description: "Data-driven insights to grow your business. Track visitors, conversions, revenue, and customer behavior.",
    highlight: false,
    gradient: "from-orange-400/10 to-amber-400/5",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    titleAr: "دعم على مدار الساعة",
    description: "Expert help whenever you need it. Our support team is available around the clock via chat, email, and phone.",
    highlight: false,
    gradient: "from-teal-400/10 to-green-400/5",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    titleAr: "أمان متقدم",
    description: "Bank-grade security for your store and customers. SSL encryption, PCI compliance, and fraud protection.",
    highlight: false,
    gradient: "from-rose-400/10 to-red-400/5",
  },
]

export default function MTServices() {
  return (
    <section className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
            Our Platform
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              Succeed
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/30 max-w-xl mx-auto">
            Comprehensive e-commerce solutions powered by cutting-edge technology
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
                    service.highlight
                      ? "bg-lime-400/15"
                      : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                  }`}
                >
                  <service.icon
                    className={`w-6 h-6 ${
                      service.highlight ? "text-lime-400" : "text-white/40 group-hover:text-white/70"
                    } transition-colors`}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                <p className="text-xs text-white/20 mb-3" dir="rtl">{service.titleAr}</p>
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
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
