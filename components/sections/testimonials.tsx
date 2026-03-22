"use client"

import { Star } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

const TESTIMONIALS = [
  {
    nameEn: "Reem Al-Otaibi",
    nameAr: "ريم العتيبي",
    roleEn: "Fashion Store · Riyadh",
    roleAr: "متجر أزياء · الرياض",
    quoteEn: "I built my fashion store in literally 4 minutes. The AI asked the right questions and the demo looked exactly what I had in mind. Worth every penny of commission.",
    quoteAr: "بنيت متجري في 4 دقائق بالضبط. الذكاء الاصطناعي سألني الأسئلة الصح والديمو طلع بالضبط اللي كان في بالي. يستاهل كل ريال عمولة.",
    stars: 5,
    avatar: "R",
    color: "#ec4899",
  },
  {
    nameEn: "Mohammed Al-Rashidi",
    nameAr: "محمد الراشدي",
    roleEn: "Electronics · Kuwait",
    roleAr: "إلكترونيات · الكويت",
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

function TestimonialCard({ item, isAr }: { item: typeof TESTIMONIALS[0]; isAr: boolean }) {
  return (
    <div className="group rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.035] transition-all duration-400 flex flex-col gap-4">
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(item.stars)].map((_, k) => (
          <Star key={k} className="w-3.5 h-3.5 fill-current" style={{ color: item.color }} />
        ))}
      </div>

      {/* Quote */}
      <p className="text-white/55 text-sm leading-relaxed flex-1" dir={isAr ? "rtl" : "ltr"}>
        "{isAr ? item.quoteAr : item.quoteEn}"
      </p>

      {/* Author */}
      <div className={`flex items-center gap-3 pt-4 border-t border-white/[0.06] ${isAr ? "flex-row-reverse" : ""}`}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-black shrink-0"
          style={{ backgroundColor: item.color }}
        >
          {item.avatar}
        </div>
        <div className={isAr ? "text-right" : ""}>
          <p className="text-white text-sm font-semibold leading-tight">
            {isAr ? item.nameAr : item.nameEn}
          </p>
          <p className="text-white/30 text-xs mt-0.5">
            {isAr ? item.roleAr : item.roleEn}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t, isAr } = useLang()

  // Split into 3 columns for a masonry-like stagger (Visuo style)
  const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0)
  const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1)
  const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2)

  return (
    <section className="py-28 px-4 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto relative">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-white/35 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Testimonials", "تجارب العملاء")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("What our ", "ماذا يقول ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("merchants are saying", "تجارنا")}
              </span>
            </h2>
            <p className="mt-4 text-white/30 max-w-md mx-auto text-sm leading-relaxed">
              {t(
                "Real stories from store owners across Saudi Arabia, UAE, Kuwait, and Egypt.",
                "قصص حقيقية من أصحاب متاجر في السعودية والإمارات والكويت ومصر."
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry 3-col grid (desktop) / 1-col (mobile) */}
        <div className="hidden lg:grid grid-cols-3 gap-5 items-start">
          <ScrollReveal delay={1}>
            <div className="flex flex-col gap-5">
              {col1.map((item) => <TestimonialCard key={item.nameEn} item={item} isAr={isAr} />)}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col gap-5 mt-8">
              {col2.map((item) => <TestimonialCard key={item.nameEn} item={item} isAr={isAr} />)}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={3}>
            <div className="flex flex-col gap-5">
              {col3.map((item) => <TestimonialCard key={item.nameEn} item={item} isAr={isAr} />)}
            </div>
          </ScrollReveal>
        </div>

        {/* Mobile / tablet: simple grid */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((item, i) => (
            <ScrollReveal key={item.nameEn} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <TestimonialCard item={item} isAr={isAr} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
