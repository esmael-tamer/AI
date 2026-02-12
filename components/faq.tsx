"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function FAQ() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: t("Do I need to sign up to see the demo?", "هل لازم أسجل عشان أشوف المتجر؟"),
      a: t("No, the demo store is generated first without signup.", "لا، المتجر التجريبي يظهر أولاً بدون تسجيل."),
    },
    {
      q: t("Is there a monthly subscription?", "هل فيه اشتراك شهري؟"),
      a: t("No, only commission after activation.", "لا، فقط عمولة على المبيعات بعد التفعيل."),
    },
    {
      q: t("When does the store go live?", "متى يصير المتجر Live؟"),
      a: t(
        "After you submit the request and our team approves and activates integrations.",
        "بعد تقديم الطلب وموافقة فريقنا على التفعيل وربط الدفع والشحن."
      ),
    },
    {
      q: t("Do you support Kuwait & Saudi?", "هل يدعم الكويت والسعودية؟"),
      a: t("Yes, and we're global-ready.", "نعم، مع قابلية التوسع لباقي الدول."),
    },
    {
      q: t("Are products limited?", "هل المنتجات محدودة؟"),
      a: t("No, unlimited products.", "لا، منتجات غير محدودة."),
    },
  ]

  return (
    <section id="faq" className="py-28 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
            {t("FAQ", "الأسئلة الشائعة")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("Common ", "أسئلة ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              {t("Questions", "شائعة")}
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i ? "border-lime-400/20 bg-white/[0.04]" : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start"
              >
                <span className="text-sm font-medium text-white/80">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-lime-400" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
