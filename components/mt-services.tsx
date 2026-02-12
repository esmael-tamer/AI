"use client"

import { Sparkles, Server, CreditCard, BarChart3, HeadphonesIcon, Shield } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    title: "AI Store Builder",
    description: "Create your complete store with our intelligent assistant. Answer a few questions and get a fully functional storefront.",
    highlight: true,
  },
  {
    icon: Server,
    title: "Premium Hosting",
    description: "Lightning-fast servers with 99.9% uptime guarantee. Your store is always online and blazing fast.",
    highlight: false,
  },
  {
    icon: CreditCard,
    title: "Payment Integration",
    description: "Accept payments globally with multi-currency support. Stripe, PayPal, Apple Pay, and local payment methods.",
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Data-driven insights to grow your business. Track visitors, conversions, revenue, and customer behavior.",
    highlight: false,
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Expert help whenever you need it. Our support team is available around the clock via chat, email, and phone.",
    highlight: false,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security for your store and customers. SSL encryption, PCI compliance, and fraud protection.",
    highlight: false,
  },
]

export default function MTServices() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Comprehensive e-commerce solutions powered by cutting-edge technology
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`group rounded-2xl p-6 transition-all hover:scale-[1.02] ${
                service.highlight
                  ? "glass-border-enhanced border-[#a3e635]/20 bg-[#a3e635]/5"
                  : "glass-border-subtle"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  service.highlight
                    ? "bg-[#a3e635]/20"
                    : "bg-white/5"
                }`}
              >
                <service.icon
                  className={`w-6 h-6 ${
                    service.highlight ? "text-[#a3e635]" : "text-muted-foreground group-hover:text-foreground"
                  } transition-colors`}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
