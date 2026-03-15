"use client"

import { useState } from "react"
import MtHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
import {
  Users,
  ClipboardList,
  Headphones,
  LineChart,
  TrendingUp,
  Settings,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react"

export default function AccountManagementPage() {
  const { t, isAr } = useLang()

  const features = [
    {
      icon: ClipboardList,
      title: "Inventory Management",
      titleAr: "إدارة المخزون",
      description: t(
        "Real-time inventory tracking, automated reorder alerts, and stock level optimization across all your sales channels.",
        "تتبع مخزون حي وتنبيهات إعادة طلب تلقائية وتحسين مستويات المخزون عبر جميع قنوات البيع."
      ),
    },
    {
      icon: Settings,
      title: "Order Processing",
      titleAr: "معالجة الطلبات",
      description: t(
        "Streamlined order fulfillment from placement to delivery — including returns, exchanges, and tracking updates.",
        "معالجة طلبات سلسة من التقديم للتسليم — بما في ذلك الإرجاع والاستبدال وتحديثات التتبع."
      ),
    },
    {
      icon: Headphones,
      title: "Customer Service",
      titleAr: "خدمة العملاء",
      description: t(
        "Dedicated bilingual support team handling inquiries, complaints, and reviews in Arabic and English.",
        "فريق دعم مخصص ثنائي اللغة يتعامل مع الاستفسارات والشكاوى والتقييمات بالعربية والإنجليزية."
      ),
    },
    {
      icon: LineChart,
      title: "Financial Reports",
      titleAr: "التقارير المالية",
      description: t(
        "Detailed revenue, expense, and profit reports with trend analysis to keep your business finances clear.",
        "تقارير تفصيلية للإيرادات والمصروفات والأرباح مع تحليل الاتجاهات."
      ),
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      titleAr: "استراتيجية النمو",
      description: t(
        "Data-driven recommendations to scale your store — product expansion, pricing strategy, and market positioning.",
        "توصيات مبنية على البيانات لتوسيع متجرك — توسيع المنتجات واستراتيجية التسعير والتموضع."
      ),
    },
    {
      icon: Users,
      title: "Daily Operations",
      titleAr: "العمليات اليومية",
      description: t(
        "End-to-end daily store management so you can focus on your business vision while we handle the details.",
        "إدارة يومية شاملة للمتجر لتتمكن من التركيز على رؤية عملك بينما نتولى التفاصيل."
      ),
    },
  ]

  const stats = [
    { number: "500+", label: "Stores Managed", labelAr: "متجر مُدار" },
    { number: "98%", label: "Client Satisfaction", labelAr: "رضا العملاء" },
    { number: "2M+", label: "Orders Processed", labelAr: "طلب تمت معالجته" },
    { number: "24/7", label: "Support Coverage", labelAr: "تغطية الدعم" },
  ]

  const orderOptions = [
    t("Under 100 orders/month", "أقل من 100 طلب/شهرياً"),
    t("100 – 500 orders/month", "100 – 500 طلب/شهرياً"),
    t("500 – 1,000 orders/month", "500 – 1,000 طلب/شهرياً"),
    t("1,000 – 5,000 orders/month", "1,000 – 5,000 طلب/شهرياً"),
    t("5,000+ orders/month", "+5,000 طلب/شهرياً"),
  ]

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    storeUrl: "",
    monthlyOrders: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

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
          type: "account_mgmt",
          payload_json: {
            store_url: form.storeUrl,
            monthly_orders: form.monthlyOrders,
          },
          notes: form.notes,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      setSuccess(true)
      setForm({ name: "", phone: "", email: "", storeUrl: "", monthlyOrders: "", notes: "" })
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
            {t("Account Management", "إدارة الحسابات")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            {t("We manage your store,", "نحن ندير متجرك،")}{" "}
            <span className="text-lime-400">{t("you grow your brand", "وأنت تنمّي علامتك التجارية")}</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Full management of your e-commerce operations — inventory, customer service, order processing, and analytics — handled by our dedicated team so you can focus on growth.",
              "إدارة كاملة لعمليات متجرك — المخزون وخدمة العملاء ومعالجة الطلبات والتحليلات — يديرها فريقنا المتخصص لتتمكن من التركيز على النمو."
            )}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t("Complete store", "عمليات المتجر")}{" "}
              <span className="text-lime-400">{t("operations", "الكاملة")}</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              {t("Everything your e-commerce business needs, managed by experts", "كل ما يحتاجه عملك، يديره خبراء")}
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
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-lime-400 mb-2">{stat.number}</div>
                <div className="text-sm text-white font-medium">{isAr ? stat.labelAr : stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-form" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t("Let us", "دعنا")}{" "}
              <span className="text-lime-400">{t("manage", "ندير")}</span>{" "}
              {t("your store", "متجرك")}
            </h2>
            <p className="text-zinc-400">
              {t("Fill in your details and our operations team will reach out within 24 hours", "أدخل بياناتك وسيتواصل فريق العمليات معك خلال 24 ساعة")}
            </p>
          </div>

          {success ? (
            <div className="bg-lime-400/10 border border-lime-400/20 rounded-2xl p-8 text-center">
              <Check className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t("Request Submitted!", "تم إرسال الطلب!")}</h3>
              <p className="text-zinc-400 text-sm">
                {t(
                  "Thank you! Our operations team will contact you shortly to discuss your account management needs.",
                  "شكراً لك! سيتواصل فريق العمليات معك قريباً لمناقشة احتياجات إدارة حسابك."
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
                  {t("Store URL", "رابط المتجر")}
                  <span className="text-zinc-600 text-xs ml-2">{t("(optional)", "(اختياري)")}</span>
                </label>
                <input
                  type="url"
                  value={form.storeUrl}
                  onChange={(e) => setForm({ ...form, storeUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                  placeholder="https://your-store.com"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  {t("Monthly Orders", "عدد الطلبات الشهرية")}
                </label>
                <select
                  value={form.monthlyOrders}
                  onChange={(e) => setForm({ ...form, monthlyOrders: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-lime-400/40 transition-colors appearance-none"
                >
                  <option value="" className="bg-zinc-900">{t("Select order volume", "اختر حجم الطلبات")}</option>
                  {orderOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
                  ))}
                </select>
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
                  placeholder={t("Tell us about your store and current challenges...", "أخبرنا عن متجرك والتحديات الحالية...")}
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
