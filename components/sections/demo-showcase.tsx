"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

const DEMO_STORES = [
  {
    nameEn: "Elegance Fashion",
    nameAr: "أناقة للأزياء",
    category: "fashion",
    categoryAr: "أزياء",
    themeColor: "#ec4899",
    slug: null,
    products: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&q=70",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=70",
    ],
  },
  {
    nameEn: "Layla's Kitchen",
    nameAr: "مطبخ ليلى",
    category: "food",
    categoryAr: "أطعمة",
    themeColor: "#f59e0b",
    slug: null,
    products: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&q=70",
      "https://images.unsplash.com/photo-1611003229641-7e343593e5cf?w=300&q=70",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=70",
    ],
  },
  {
    nameEn: "Glow Collective",
    nameAr: "غلو للجمال",
    category: "beauty",
    categoryAr: "جمال",
    themeColor: "#8b5cf6",
    slug: null,
    products: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=70",
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&q=70",
      "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=300&q=70",
    ],
  },
]

export default function DemoShowcase() {
  const { t, isAr } = useLang()

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-lime-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-white/40 text-xs font-medium uppercase tracking-widest mb-6">
              {t("Live Demo Stores", "متاجر تجريبية حقيقية")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("See what your ", "شوف كيف يكون ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("store looks like", "متجرك")}
              </span>
            </h2>
            <p className="mt-4 text-white/35 text-base max-w-xl mx-auto">
              {t(
                "These are real AI-generated stores. Yours will be ready in under 3 minutes.",
                "هذه متاجر حقيقية بناها الذكاء الاصطناعي. متجرك سيكون جاهزاً في أقل من 3 دقائق."
              )}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_STORES.map((store, i) => (
            <ScrollReveal key={store.nameEn} delay={i + 1 as 1 | 2 | 3}>
              <div className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/15 transition-all duration-500 hover:-translate-y-1 bg-white/[0.02]">
                {/* Store header bar */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]" style={{ backgroundColor: store.themeColor + "18" }}>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-bold text-xs shrink-0"
                    style={{ backgroundColor: store.themeColor }}
                  >
                    {store.nameEn[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{isAr ? store.nameAr : store.nameEn}</p>
                    <p className="text-white/40 text-xs">{isAr ? store.categoryAr : store.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: store.themeColor }} />
                  </div>
                </div>

                {/* Product image grid */}
                <div className="grid grid-cols-3 gap-0.5 bg-white/[0.03]">
                  {store.products.map((img, j) => (
                    <div key={j} className="aspect-square relative overflow-hidden">
                      <Image
                        src={img}
                        alt={`${store.nameEn} product ${j + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                {/* Store footer */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, k) => (
                        <div key={k} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: store.themeColor + (k < 4 ? "cc" : "30") }} />
                      ))}
                    </div>
                    <p className="text-white/30 text-xs">{t("3 products shown", "3 منتجات معروضة")}</p>
                  </div>
                  <Link
                    href="/builder"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: store.themeColor }}
                  >
                    <ShoppingBag className="w-3 h-3" />
                    {t("Build mine", "أبني مثله")}
                    <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={4}>
          <div className="mt-10 text-center">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-lime-400 transition-colors"
            >
              {t("Start building your store — free, no signup needed", "ابنِ متجرك الآن — مجاني بدون تسجيل")}
              <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
