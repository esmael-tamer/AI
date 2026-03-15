"use client"

import { useState, useEffect } from "react"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLang } from "@/lib/i18n"

interface CaseStudy {
  id: number
  title_en: string | null
  title_ar: string | null
  desc_en: string | null
  desc_ar: string | null
  category: string | null
  client_name: string | null
  cover_image: string | null
  sort_order: number
}

export default function WorkPage() {
  const { t, isAr } = useLang()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    fetch("/api/admin/cases")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCaseStudies(data)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen">
      <MTHeader />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              {isAr ? (
                <span className="text-[#a3e635]">أعمالنا</span>
              ) : (
                <>Our <span className="text-[#a3e635]">Work</span></>
              )}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              {t("Real results for real businesses. See how we have helped brands transform their digital presence.", "نتائج حقيقية لأعمال حقيقية.")}
            </p>
          </div>

          {/* Case Studies Grid */}
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study) => (
                <Link key={study.id} href={`/work/${study.id}`} className="group glass-border rounded-2xl overflow-hidden hover:scale-[1.02] transition-all block">
                  <div className="aspect-video bg-white/5 relative">
                    {study.cover_image && (
                      <img src={study.cover_image || "/placeholder.svg"} alt={(isAr ? study.title_ar : study.title_en) || ""} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs text-[#a3e635] font-medium uppercase tracking-wider">{study.category}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{isAr ? study.title_ar : study.title_en}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{isAr ? study.desc_ar : study.desc_en}</p>
                    {study.client_name && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {t("Client:", "العميل:")} <span className="text-foreground">{study.client_name}</span>
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <p className="text-muted-foreground">{t("Case studies coming soon.", "دراسات الحالة قريباً.")}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#a3e635] text-black font-semibold rounded-full hover:bg-[#bef264] transition-all"
            >
              {t("Start Your Project", "ابدأ مشروعك")}
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
