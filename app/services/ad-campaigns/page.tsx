"use client"

import { useState } from "react"
import MtHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
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

export default function AdCampaignsPage() {
  const { t, isAr } = useLang()

  const features = [
    {
      icon: Target,
      title: "Campaign Strategy",
      titleAr: "استراتيجية الحملات",
      description: t(
        "Data-driven campaign planning tailored to your business goals, target audience, and market positioning.",
        "تخطيط حملات مبني على البيانات مصمم لأهداف عملك وجمهورك المستهدف."
      ),
    },
    {
      icon: Megaphone,
      title: "Creative Design",
      titleAr: "التصميم الإبداعي",
      description: t(
        "Eye-catching ad creatives optimized for each platform — static, video, carousel, and story formats.",
        "إعلانات إبداعية جذابة محسّنة لكل منصة — صور ثابتة وفيديو وكاروسيل."
      ),
    },
    {
      icon: Zap,
      title: "Platform Management",
      titleAr: "إدارة المنصات",
      description: t(
        "Expert management across Google Ads, Meta, TikTok, and Snapchat with continuous optimization.",
        "إدارة احترافية عبر Google Ads وMeta وTikTok وSnapchat مع تحسين مستمر."
      ),
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      titleAr: "تتبع الأداء",
      description: t(
        "Real-time dashboards and weekly reports tracking ROAS, CPA, CTR, and conversion metrics.",
        "لوحات تحكم مباشرة وتقارير أسبوعية لتتبع ROAS وCPA ومعدلات التحويل."
      ),
    },
    {
      icon: DollarSign,
      title: "Budget Optimization",
      titleAr: "تحسين الميزانية",
      description: t(
        "Smart budget allocation across platforms and campaigns to maximize your return on ad spend.",
        "توزيع ذكي للميزانية عبر المنصات والحملات لتحقيق أقصى عائد."
      ),
    },
    {
      icon: TrendingUp,
      title: "Reporting & Insights",
      titleAr: "التقارير والرؤى",
      description: t(
        "Comprehensive monthly reports with actionable insights and growth recommendations.",
        "تقارير شهرية شاملة مع رؤى عملية وتوصيات للنمو."
      ),
    },
  ]

  const packages = [
    {
      name: "Starter",
      nameAr: "البداية",
      adSpend: t("Up to $2,000/mo", "حتى $2,000/شهرياً"),
      price: "$499",
      period: t("/month", "/شهرياً"),
      features: [
        t("2 platforms included", "منصتان مشمولتان"),
        t("Campaign setup & launch", "إعداد وإطلاق الحملات"),
        t("Weekly performance reports", "تقارير أداء أسبوعية"),
        t("Basic A/B testing", "اختبار A/B أساسي"),
        t("Monthly strategy call", "مكالمة استراتيجية شهرية"),
      ],
    },
    {
      name: "Growth",
      nameAr: "النمو",
      adSpend: t("$2,000 – $10,000/mo", "$2,000 – $10,000/شهرياً"),
      price: "$999",
      period: t("/month", "/شهرياً"),
      popular: true,
      features: [
        t("4 platforms included", "4 منصات مشمولة"),
        t("Advanced audience targeting", "استهداف جمهور متقدم"),
        t("Custom creative design", "تصميم إبداعي مخصص"),
        t("Daily optimization", "تحسين يومي"),
        t("Bi-weekly strategy calls", "مكالمات استراتيجية نصف شهرية"),
        t("Conversion tracking setup", "إعداد تتبع التحويلات"),
      ],
    },
    {
      name: "Enterprise",
      nameAr: "المؤسسات",
      adSpend: t("$10,000+/mo", "+$10,000/شهرياً"),
      price: t("Custom", "مخصص"),
      period: "",
      features: [
        t("All platforms", "جميع المنصات"),
        t("Dedicated account manager", "مدير حساب مخصص"),
        t("Full creative production", "إنتاج إبداعي كامل"),
        t("Real-time dashboard", "لوحة تحكم مباشرة"),
        t("Weekly strategy sessions", "جلسات استراتيجية أسبوعية"),
        t("Landing page optimization", "تحسين صفحات الهبوط"),
        t("Competitor analysis", "تحليل المنافسين"),
      ],
    },
  ]

  const platforms = [
    { id: "google", label: "Google Ads" },
    { id: "meta", label: t("Meta (Facebook & Instagram)", "Meta (فيسبوك وإنستغرام)") },
    { id: "tiktok", label: t("TikTok Ads", "إعلانات TikTok") },
    { id: "snapchat", label: t("Snapchat Ads", "إعلانات Snapchat") },
  ]

  const budgetOptions = [
    t("Under $1,000/month", "أقل من $1,000/شهرياً"),
    t("$1,000 – $3,000/month", "$1,000 – $3,000/شهرياً"),
    t("$3,000 – $5,000/month", "$3,000 – $5,000/شهرياً"),
    t("$5,000 – $10,000/month", "$5,000 – $10,000/شهرياً"),
    t("$10,000+/month", "+$10,000/شهرياً"),
  ]

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
      setError(t("Please fill in your name, email, and phone number.", "يرجى ملء الاسم والبريد والهاتف."))
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
      setError(t("Something went wrong. Please try again.", "حدث خطأ. يرجى المحاولة مرة أخرى."))
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
            {t("Ad Campaign Management", "إدارة الحملات الإعلانية")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            {t("Scale your business with", "وسّع عملك مع")}{" "}
            <span className="text-lime-400">{t("paid advertising", "الإعلانات المدفوعة")}</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {t(
              "We run high-performing ad campaigns on Google, Meta, TikTok, and Snapchat — designed to drive traffic, conversions, and revenue for your e-commerce store.",
              "ندير حملات إعلانية عالية الأداء على Google وMeta وTikTok وSnapchat — مصممة لزيادة الزيارات والتحويلات والإيرادات لمتجرك."
            )}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t("What we", "ما")}{" "}
              <span className="text-lime-400">{t("deliver", "نقدمه")}</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              {t("End-to-end campaign management from strategy to reporting", "إدارة حملات شاملة من الاستراتيجية إلى التقارير")}
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
                <h3 className="text-xl font-semibold text-white mb-1">{isAr ? f.titleAr : f.title}</h3>
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
              {t("Choose your", "اختر")}{" "}
              <span className="text-lime-400">{t("package", "باقتك")}</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              {t("Flexible plans to match your ad budget and growth stage", "خطط مرنة لتناسب ميزانيتك ومرحلة نموك")}
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
                    {t("Most Popular", "الأكثر شعبية")}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white">{isAr ? pkg.nameAr : pkg.name}</h3>
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
                  {t("Get Started", "ابدأ الآن")}
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
              {t("Start your", "ابدأ")}{" "}
              <span className="text-lime-400">{t("campaign", "حملتك")}</span>
            </h2>
            <p className="text-zinc-400">
              {t("Fill in your details and our team will reach out within 24 hours", "أدخل بياناتك وسيتواصل فريقنا معك خلال 24 ساعة")}
            </p>
          </div>

          {success ? (
            <div className="bg-lime-400/10 border border-lime-400/20 rounded-2xl p-8 text-center">
              <Check className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t("Request Submitted!", "تم إرسال الطلب!")}</h3>
              <p className="text-zinc-400 text-sm">
                {t(
                  "Thank you! Our team will contact you shortly to discuss your ad campaign needs.",
                  "شكراً لك! سيتواصل فريقنا معك قريباً لمناقشة احتياجات حملتك الإعلانية."
                )}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm transition-all"
              >
                {t("Submit Another Request", "إرسال طلب آخر")}
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
                    {t("Name", "الاسم")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                    placeholder={t("Your full name", "اسمك الكامل")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    {t("Phone", "الهاتف")}
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
                  {t("Email", "البريد الإلكتروني")}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                  placeholder={t("your@email.com", "بريدك@مثال.com")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  {t("Monthly Ad Budget", "ميزانية الإعلانات الشهرية")}
                </label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-lime-400/40 transition-colors appearance-none"
                >
                  <option value="" className="bg-zinc-900">{t("Select budget range", "اختر نطاق الميزانية")}</option>
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-3">
                  {t("Platforms Interested", "المنصات المهتم بها")}
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
                  {t("Notes", "ملاحظات")}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors resize-none"
                  placeholder={t("Tell us about your business and goals...", "أخبرنا عن عملك وأهدافك...")}
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
                    {t("Submitting...", "جاري الإرسال...")}
                  </>
                ) : (
                  <>
                    {t("Submit Request", "إرسال الطلب")}
                    <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <MTFooter />
    </div>
  )
}
