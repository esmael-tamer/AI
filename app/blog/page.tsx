import MTHeader from "@/components/mt-header"
import MTFooter from "@/components/mt-footer"
import { sql } from "@/lib/db"
import type { BlogPost } from "@/lib/db"
import Link from "next/link"
import { Calendar } from "lucide-react"

export const metadata = {
  title: "Blog | Media Trend",
  description: "Insights, guides, and news about e-commerce, AI, and digital business growth.",
}

export default async function BlogPage() {
  let posts: BlogPost[] = []
  try {
    posts = (await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`) as BlogPost[]
  } catch {
    posts = []
  }

  return (
    <main className="min-h-screen">
      <MTHeader />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Our <span className="text-[#a3e635]">Blog</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Insights, guides, and the latest news about e-commerce and digital growth.
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
                      <img src={post.cover_image || "/placeholder.svg"} alt={post.title_en || ""} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-[#a3e635] transition-colors line-clamp-2">
                      {post.title_en}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt_en}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <p className="text-muted-foreground">Blog posts coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
