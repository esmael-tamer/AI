import Link from "next/link"
import { Check, ArrowRight, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Try Free",
    nameAr: "جرّب مجاناً",
    price: "Free",
    priceAr: "مجاني",
    description: "Build your demo store with AI — no signup, no credit card. See what's possible.",
    features: [
      "AI Store Builder",
      "Up to 50 Products",
      "Demo store preview",
      "Basic analytics",
      "Free SSL Certificate",
      "Mobile responsive",
    ],
    cta: "Start Building Free",
    highlight: false,
  },
  {
    name: "Launch",
    nameAr: "أطلق متجرك",
    price: "0%",
    priceAr: "بدون رسوم",
    description: "Go live with payments, shipping & warehousing. Pay only commission on actual sales.",
    features: [
      "Everything in Free",
      "Activate payments",
      "Shipping integration",
      "Warehousing service",
      "Custom domain",
      "Priority support",
      "Advanced analytics",
      "WhatsApp integration",
    ],
    cta: "Activate Your Store",
    highlight: true,
    badge: "Commission Only",
  },
  {
    name: "Enterprise",
    nameAr: "المؤسسات",
    price: "Custom",
    priceAr: "حسب الطلب",
    description: "Full-service e-commerce management. We run your store, you grow your brand.",
    features: [
      "Everything in Launch",
      "Dedicated account manager",
      "Ad campaign management",
      "Full store operations",
      "Inventory management",
      "Customer service team",
      "Growth strategy",
      "White label option",
      "API access",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-400/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            No subscriptions,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              just growth
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/30 max-w-xl mx-auto">
            Build for free, launch with zero upfront costs. We earn when you earn — commission on sales only.
          </p>
          <p className="mt-2 text-sm text-white/20" dir="rtl">
            ابني مجاناً، أطلق بدون تكاليف مقدمة. نكسب عندما تكسب — عمولة على المبيعات فقط
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 ${
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
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className="text-xs text-white/20">/ {plan.nameAr}</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.price !== "Custom" && plan.price !== "Free" && (
                    <span className="text-white/30 text-sm mb-1">upfront</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-white/30 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? "bg-lime-400/20" : "bg-white/5"}`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? "text-lime-400" : "text-white/40"}`} />
                    </div>
                    <span className="text-sm text-white/50">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/builder"}
                className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-lime-400 text-black hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                    : "border border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
