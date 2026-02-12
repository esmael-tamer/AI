import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Perfect for getting started with your first online store.",
    features: [
      "1 Store",
      "Up to 50 Products",
      "Basic Analytics",
      "Standard Support",
      "Free SSL Certificate",
      "Mobile Responsive",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/mo",
    description: "For growing businesses that need more power and flexibility.",
    features: [
      "5 Stores",
      "Unlimited Products",
      "Advanced Analytics",
      "Priority Support",
      "Custom Domain",
      "AI Recommendations",
      "Multi-currency",
      "Ad Campaign Tools",
    ],
    cta: "Start Free Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    description: "Advanced features for large-scale e-commerce operations.",
    features: [
      "Unlimited Stores",
      "Unlimited Products",
      "Enterprise Analytics",
      "24/7 Dedicated Support",
      "Custom Integrations",
      "AI Store Builder Pro",
      "White Label Option",
      "API Access",
      "Account Manager",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
            Our Pricing
          </h2>
          <p className="mt-4 text-lg text-white/40 max-w-xl mx-auto">
            No hidden fees. Just world-class tools to build and grow your e-commerce business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 bg-[#0a0a0a] border ${
                plan.highlight
                  ? "border-[#a3e635]/30 shadow-[0_0_30px_rgba(163,230,53,0.1)]"
                  : "border-white/10"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#a3e635] text-black text-xs font-bold rounded-full uppercase tracking-wide">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-white/40">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span className="text-sm text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/builder"}
                className={`block text-center w-full py-3 rounded-full text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-[#a3e635] text-black hover:bg-[#bef264]"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
