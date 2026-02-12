"use client"

import Link from "next/link"
import { useState } from "react"
import MtHeader from "@/components/mt-header"
import MtFooter from "@/components/mt-footer"
import {
  Megaphone,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  DollarSign,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Campaign Strategy",
    titleAr: "استراتيجية الحملات",
    description: "Data-driven campaign planning tailored to your business goals, target audience, and market positioning.",
  },
  {
    icon: Megaphone,
    title: "Creative Design",
    titleAr: "التصميم الإبداعي",
    description: "Eye-catching ad creatives optimized for each platform — static, video, carousel, and story formats.",
  },
  {
    icon: Zap,
    title: "Platform Management",
    titleAr: "إدارة المنصات",
    description: "Expert management across Google Ads, Meta, TikTok, and Snapchat with continuous optimization.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    titleAr: "تتبع الأداء",
    description: "Real-time dashboards and weekly reports tracking ROAS, CPA, CTR, and conversion metrics.",
  },
  {
    icon: DollarSign,
    title: "Budget Optimization",
    titleAr: "تحسين الميزانية",
    description: "Smart budget allocation across platforms and campaigns to maximize your return on ad spend.",
  },
  {
    icon: TrendingUp,
    title: "Reporting & Insights",
    titleAr: "التقارير والرؤى",
    description: "Comprehensive monthly reports with actionable insights and growth recommendations.",
  },
]

const packages = [
  {
    name: "Starter",
    nameAr: "البداية",
    adSpend: "Up to $2,000/mo",
    price: "$499",
    period: "/month",
    features: [
      "2 platforms included",
      "Campaign setup & launch",
      "Weekly performance reports",
      "Basic A/B testing",
      "Monthly strategy call",
    ],
  },
  {
    name: "Growth",
    nameAr: "النمو",
    adSpend: "$2,000 – $10,000/mo",
    price: "$999",
    period: "/month",
    popular: true,
    features: [
      "4 platforms included",
      "Advanced audience targeting",
      "Custom creative design",
      "Daily optimization",
      "Bi-weekly strategy calls",
      "Conversion tracking setup",
    ],
  },
  {
    name: "Enterprise",
    nameAr: "المؤسسات",
    adSpend: "$10,000+/mo",
    price: "Custom",
    period: "",
    features: [
      "All platforms",
      "Dedicated account manager",
      "Full creative production",
      "Real-time dashboard",
      "Weekly strategy sessions",
      "Landing page optimization",
      "Competitor analysis",
    ],
  },
]

const platforms = [
  { id: "google", label: "Google Ads" },
  { id: "meta", label: "Meta (Facebook & Instagram)" },
  { id: "tiktok", label: "TikTok Ads" },
  { id: "snapchat", label: "Snapchat Ads" },
]

const budgetOptions = [
  "Under $1,000/month",
  "$1,000 – $3,000/month",
  "$3,000 – $5,000/month",
  "$5,000 – $10,000/month",
  "$10,000+/month",
]

export default function AdCampaignsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    platforms: [] as string[],
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function togglePlatform(id: string) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in your name, email, and phone number.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          type: "ads_launch",
          payload_json: {
            monthly_budget: form.budget,
            platforms: form.platforms,
          },
          notes: form.notes,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      setSuccess(true)
      setForm({ name: "", phone: "", email: "", budget: "", platforms: [], notes: "" })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MtHeader />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-6">
            Ad Campaign Management
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            Scale your business with{" "}
            <span className="text-lime-400">paid advertising</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-3" dir="rtl">
            إدارة الحملات الإعلانية
          </p>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            We run high-performing ad campaigns on Google, Meta, TikTok, and Snapchat — 
            designed to drive traffic, conversions, and revenue for your e-commerce store.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What we <span className="text-lime-400">deliver</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              End-to-end campaign management from strategy to reporting
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-lime-400/20 transition-all group"
              >
                <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-lime-400/20 transition-colors">
                  <f.icon className="w-6 h-6 text-lime-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-zinc-500 text-sm mb-3" dir="rtl">{f.titleAr}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Choose your <span className="text-lime-400">package</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Flexible plans to match your ad budget and growth stage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 relative ${
                  pkg.popular ? "border-lime-400/40" : "border-white/10"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime-400 text-black text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
                <p className="text-zinc-500 text-sm" dir="rtl">{pkg.nameAr}</p>
                <p className="text-zinc-400 text-xs mt-2">{pkg.adSpend}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-white">{pkg.price}</span>
                  <span className="text-zinc-500 text-sm">{pkg.period}</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="text-zinc-400 text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#lead-form"
                  className={`mt-6 block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    pkg.popular
                      ? "bg-lime-400 hover:bg-lime-300 text-black"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-form" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Start your <span className="text-lime-400">campaign</span>
            </h2>
            <p className="text-zinc-400">
              Fill in your details and our team will reach out within 24 hours
            </p>
          </div>

          {success ? (
            <div className="bg-lime-400/10 border border-lime-400/20 rounded-2xl p-8 text-center">
              <Check className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Request Submitted!</h3>
              <p className="text-zinc-400 text-sm">
                Thank you! Our team will contact you shortly to discuss your ad campaign needs.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm transition-all"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    Name <span className="text-zinc-600">/ الاسم</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    Phone <span className="text-zinc-600">/ الهاتف</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                    placeholder="+966 5XX XXX XXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Email <span className="text-zinc-600">/ البريد الإلكتروني</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Monthly Ad Budget <span className="text-zinc-600">/ ميزانية الإعلانات الشهرية</span>
                </label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-lime-400/40 transition-colors appearance-none"
                >
                  <option value="" className="bg-zinc-900">Select budget range</option>
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-3">
                  Platforms Interested <span className="text-zinc-600">/ المنصات المهتم بها</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${
                        form.platforms.includes(p.id)
                          ? "bg-lime-400/10 border-lime-400/30 text-white"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          form.platforms.includes(p.id)
                            ? "border-lime-400 bg-lime-400"
                            : "border-zinc-600"
                        }`}
                      >
                        {form.platforms.includes(p.id) && <Check className="w-3 h-3 text-black" />}
                      </div>
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Notes <span className="text-zinc-600">/ ملاحظات</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors resize-none"
                  placeholder="Tell us about your business and goals..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <MtFooter />
    </div>
  )
}
