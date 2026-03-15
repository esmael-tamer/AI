"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react"

interface BlogPost {
  id: number
  title_en: string | null
  title_ar: string | null
  excerpt_en: string | null
  excerpt_ar: string | null
  content_en: string | null
  content_ar: string | null
  slug: string
  cover_image: string | null
  published_at: string | null
  status: string
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, isAr } = useLang()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        if (Array.isArray(data)) {
          const found = data.find((p) => p.slug === slug && p.status === "published")
          if (found) {
            setPost(found)
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
  }, [slug])

  const title = post ? (isAr ? post.title_ar : post.title_en) : null
  const content = post ? (isAr ? post.content_ar : post.content_en) : null
  const excerpt = post ? (isAr ? post.excerpt_ar : post.excerpt_en) : null

  const readingTime = content
    ? Math.ceil(content.split(/\s+/).length / 200)
    : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      <article className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors mb-10 group ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            )}
            {t("Back to Blog", "العودة إلى المدونة")}
          </Link>

          {/* Loading */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-white/5 rounded-lg w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="aspect-video bg-white/5 rounded-2xl mt-8" />
              <div className="space-y-3 mt-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-white/5 rounded" />
                ))}
              </div>
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg mb-6">{t("Post not found.", "المقال غير موجود.")}</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-lime-400 text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-lime-300 transition-all"
              >
                {t("View All Posts", "عرض جميع المقالات")}
              </Link>
            </div>
          )}

          {/* Post content */}
          {!loading && post && (
            <>
              {/* Meta */}
              <div className={`flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6 ${isAr ? "flex-row-reverse" : ""}`}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
                {readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {isAr ? `${readingTime} دقائق قراءة` : `${readingTime} min read`}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6 ${isAr ? "text-right" : "text-left"}`}>
                {title}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className={`text-zinc-400 text-lg leading-relaxed mb-8 border-l-2 border-lime-400/50 pl-4 ${isAr ? "border-l-0 border-r-2 pr-4 pl-0 text-right" : ""}`}>
                  {excerpt}
                </p>
              )}

              {/* Cover image */}
              {post.cover_image && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-white/5">
                  <img
                    src={post.cover_image}
                    alt={title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              {content ? (
                <div className={`prose prose-invert prose-lime max-w-none ${isAr ? "text-right" : "text-left"}`}
                  style={{ direction: isAr ? "rtl" : "ltr" }}
                >
                  {content.split("\n").map((paragraph, i) =>
                    paragraph.trim() ? (
                      <p key={i} className="text-zinc-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ) : (
                      <br key={i} />
                    )
                  )}
                </div>
              ) : (
                <p className="text-zinc-400 text-center py-8">
                  {t("Full content coming soon.", "المحتوى الكامل قريباً.")}
                </p>
              )}

              {/* Footer CTA */}
              <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors group"
                >
                  <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-0.5 transition-transform ${isAr ? "rotate-180" : ""}`} />
                  {t("All Articles", "جميع المقالات")}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105"
                >
                  {t("Get Started", "ابدأ الآن")}
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
