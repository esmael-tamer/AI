"use client"

import { Star, Quote } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

const TESTIMONIALS = [
  {
    nameEn: "Reem Al-Otaibi",
    nameAr: "ريم العتيبي",
    roleEn: "Fashion Store Owner · Riyadh",
    roleAr: "صاحبة متجر أزياء · الرياض",
    quoteEn: "I built my fashion store in literally 4 minutes. The AI asked the right questions and the demo looked exactly what I had in mind. Worth every penny of commission.",
    quoteAr: "بنيت متجري في 4 دقائق بالضبط. الذكاء الاصطناعي سألني الأسئلة الصح والديمو طلع بالضبط اللي كان في بالي. يستاهل كل ريال عمولة.",
    stars: 5,
    avatar: "R",
    color: "#ec4899",
  },
  {
    nameEn: "Mohammed Al-Rashidi",
    nameAr: "محمد الراشدي",
    roleEn: "Electronics Retailer · Kuwait",
    roleAr: "بائع إلكترونيات · الكويت",
    quoteEn: "KNET and Apple Pay were integrated from day one. The team activated everything within 48 hours. Our sales went up 35% in the first month.",
    quoteAr: "KNET وآبل باي اتربطوا من اليوم الأول. الفريق فعّل كل شيء خلال 48 ساعة. مبيعاتنا ارتفعت 35% في الشهر الأول.",
    stars: 5,
    avatar: "M",
    color: "#3b82f6",
  },
  {
    nameEn: "Layla Hassan",
    nameAr: "ليلى حسن",
    roleEn: "Food Business · Cairo",
    roleAr: "مشروع أطعمة · القاهرة",
    quoteEn: "No monthly subscription was the deal-breaker for me. I pay only when I sell. The Arabic storefront is clean and my customers love it.",
    quoteAr: "عدم وجود اشتراك شهري كان السبب الأساسي لاختياري. أدفع فقط لما أبيع. الواجهة العربية نظيفة وعملائي يحبونها.",
    stars: 5,
    avatar: "L",
    color: "#f59e0b",
  },
  {
    nameEn: "Faisal Al-Dosari",
    nameAr: "فيصل الدوسري",
    roleEn: "Sports Equipment · Doha",
    roleAr: "معدات رياضية · الدوحة",
    quoteEn: "I tried 3 platforms before this. None had real MENA shipping integration. Media Trend team set up local couriers for us in under a week.",
    quoteAr: "جربت 3 منصات قبل هذه. ما فيها تكامل حقيقي للشحن في المنطقة. فريق ميديا ترند رتّب لنا شركات توصيل محلية في أقل من أسبوع.",
    stars: 5,
    avatar: "F",
    color: "#10b981",
  },
  {
    nameEn: "Sara Al-Mansoori",
    nameAr: "سارة المنصوري",
    roleEn: "Beauty Brand · Dubai",
    roleAr: "ماركة جمال · دبي",
    quoteEn: "The demo store impressed my investors before I even paid a dirham. We went live in 5 days. Conversion rate is better than my old Shopify store.",
    quoteAr: "المتجر التجريبي أثّر على مستثمريني قبل أن أدفع درهماً واحداً. انطلقنا خلال 5 أيام. معدل التحويل أفضل من متجري القديم على شوبيفاي.",
    stars: 5,
    avatar: "S",
    color: "#8b5cf6",
  },
  {
    nameEn: "Omar Al-Zahrani",
    nameAr: "عمر الزهراني",
    roleEn: "Home Decor · Jeddah",
    roleAr: "ديكور منزلي · جدة",
    quoteEn: "Building the demo was fun — like chatting with a knowledgeable friend. The store came out with my brand colors and Arabic name perfectly set.",
    quoteAr: "بناء الديمو كان ممتعاً — مثل الدردشة مع صديق خبير. المتجر طلع بألوان علامتي التجارية واسمي العربي مضبوطين بشكل مثالي.",
    stars: 5,
    avatar: "O",
    color: "#06b6d4",
  },
]

export default function Testimonials() {
  const { t, isAr } = useLang()

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Merchant Stories", "تجارب التجار")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("Trusted by ", "يثق بنا ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("MENA merchants", "تجار المنطقة")}
              </span>
            </h2>
            <p className="mt-4 text-white/35 max-w-xl mx-auto">
              {t(
                "Real stories from store owners across Saudi Arabia, UAE, Kuwait, and Egypt.",
                "قصص حقيقية من أصحاب متاجر في السعودية والإمارات والكويت ومصر."
              )}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item, i) => (
            <ScrollReveal key={item.nameEn} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="group relative rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                <Quote className="w-6 h-6 text-white/10 mb-4 shrink-0" style={{ color: item.color + "40" }} />

                <p className="text-sm text-white/60 leading-relaxed flex-1" dir={isAr ? "rtl" : "ltr"}>
                  {isAr ? item.quoteAr : item.quoteEn}
                </p>

                <div className={`mt-5 pt-5 border-t border-white/[0.06] flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.avatar}
                  </div>
                  <div className={`flex-1 min-w-0 ${isAr ? "text-right" : ""}`}>
                    <p className="text-white text-sm font-semibold truncate">
                      {isAr ? item.nameAr : item.nameEn}
                    </p>
                    <p className="text-white/30 text-xs truncate">
                      {isAr ? item.roleAr : item.roleEn}
                    </p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[...Array(item.stars)].map((_, k) => (
                      <Star key={k} className="w-3 h-3 fill-current" style={{ color: item.color }} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
