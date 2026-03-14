"use client"

import { useState, useEffect } from "react"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { useLang } from "@/lib/i18n"

interface BlogPost {
  id: number
  title_en: string | null
  title_ar: string | null
  excerpt_en: string | null
  excerpt_ar: string | null
  slug: string
  cover_image: string | null
  published_at: string | null
  status: string
}

export default function BlogPage() {
  const { t, isAr } = useLang()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetch("/api/admin/blog?status=published")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data)
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
                <span className="text-[#a3e635]">مدونتنا</span>
              ) : (
                <>Our <span className="text-[#a3e635]">Blog</span></>
              )}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              {t("Insights, guides, and the latest news about e-commerce and digital growth.", "رؤى وأدلة وآخر الأخبار عن التجارة الإلكترونية.")}
            </p>
          </div>

          {/* Blog Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group glass-border-subtle rounded-2xl overflow-hidden hover:scale-[1.02] transition-all"
                >
                  <div className="aspect-video bg-white/5 relative">
                    {post.cover_image && (
                      <img src={post.cover_image || "/placeholder.svg"} alt={(isAr ? post.title_ar : post.title_en) || ""} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-[#a3e635] transition-colors line-clamp-2">
                      {isAr ? post.title_ar : post.title_en}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{isAr ? post.excerpt_ar : post.excerpt_en}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <p className="text-muted-foreground">{t("Blog posts coming soon.", "مقالات المدونة قريباً.")}</p>
            </div>
          )}
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
