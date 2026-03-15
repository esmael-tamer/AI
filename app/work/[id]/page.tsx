"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, ExternalLink, Tag, Building2 } from "lucide-react"

interface CaseStudy {
  id: number
  title_en: string | null
  title_ar: string | null
  desc_en: string | null
  desc_ar: string | null
  category: string | null
  client_name: string | null
  cover_image: string | null
  gallery: string | string[] | null
  sort_order: number
}

export default function CaseStudyPage() {
  const { id } = useParams<{ id: string }>()
  const { t, isAr } = useLang()
  const [study, setStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch("/api/admin/cases")
      .then((res) => res.json())
      .then((data: CaseStudy[]) => {
        if (Array.isArray(data)) {
          const found = data.find((c) => String(c.id) === String(id))
          if (found) {
            setStudy(found)
          } else {
            setNotFound(true)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  const title = study ? (isAr ? study.title_ar : study.title_en) : null
  const description = study ? (isAr ? study.desc_ar : study.desc_en) : null

  const galleryImages: string[] = study?.gallery
    ? Array.isArray(study.gallery)
      ? (study.gallery as string[])
      : typeof study.gallery === "string"
      ? JSON.parse(study.gallery as string)
      : []
    : []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      <article className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            href="/work"
            className={`inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors mb-10 group ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            )}
            {t("Back to Work", "العودة إلى الأعمال")}
          </Link>

          {/* Loading */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/4 mb-4" />
              <div className="h-10 bg-white/5 rounded-lg w-3/4" />
              <div className="aspect-video bg-white/5 rounded-2xl mt-8" />
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg mb-6">{t("Case study not found.", "دراسة الحالة غير موجودة.")}</p>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-lime-400 text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-lime-300 transition-all"
              >
                {t("View All Work", "عرض جميع الأعمال")}
              </Link>
            </div>
          )}

          {/* Case study content */}
          {!loading && study && (
            <>
              {/* Badges */}
              <div className={`flex flex-wrap items-center gap-3 mb-5 ${isAr ? "flex-row-reverse" : ""}`}>
                {study.category && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {study.category}
                  </span>
                )}
                {study.client_name && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-400 text-xs">
                    <Building2 className="w-3 h-3" />
                    {study.client_name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-8 ${isAr ? "text-right" : "text-left"}`}>
                {title}
              </h1>

              {/* Cover image */}
              {study.cover_image && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-white/5">
                  <img
                    src={study.cover_image}
                    alt={title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {description && (
                <div className={`mb-12 ${isAr ? "text-right" : "text-left"}`} style={{ direction: isAr ? "rtl" : "ltr" }}>
                  <h2 className="text-xl font-bold text-white mb-4">{t("About this project", "عن هذا المشروع")}</h2>
                  {description.split("\n").map((paragraph, i) =>
                    paragraph.trim() ? (
                      <p key={i} className="text-zinc-300 leading-relaxed mb-4 text-lg">
                        {paragraph}
                      </p>
                    ) : (
                      <br key={i} />
                    )
                  )}
                </div>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-12">
                  <h2 className={`text-xl font-bold text-white mb-5 ${isAr ? "text-right" : "text-left"}`}>
                    {t("Project Gallery", "معرض المشروع")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden bg-white/5">
                        <img
                          src={img}
                          alt={`${title || ""} - ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-10 p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {t("Ready to start your project?", "جاهز لبدء مشروعك؟")}
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  {t("Let us help you achieve similar results for your business.", "دعنا نساعدك على تحقيق نتائج مماثلة لعملك.")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105"
                  >
                    {t("Start Your Project", "ابدأ مشروعك")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-6 py-3 rounded-full text-sm transition-all"
                  >
                    {t("View All Work", "عرض جميع الأعمال")}
                  </Link>
                </div>
              </div>

              {/* Back */}
              <div className="mt-10 flex items-center">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors group"
                >
                  <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-0.5 transition-transform ${isAr ? "rotate-180" : ""}`} />
                  {t("All Case Studies", "جميع دراسات الحالة")}
                </Link>
              </div>
            </>
          )}
        </div>
      </article>

      <MTFooter />
    </div>
  )
}
