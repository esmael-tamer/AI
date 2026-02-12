import MTHeader from "@/components/mt-header"
import MTFooter from "@/components/mt-footer"
import { sql } from "@/lib/db"
import type { CaseStudy } from "@/lib/db"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Work | Media Trend",
  description: "Explore our portfolio of successful e-commerce stores and digital transformations.",
}

export default async function WorkPage() {
  let caseStudies: CaseStudy[] = []
  try {
    caseStudies = (await sql`SELECT * FROM case_studies ORDER BY sort_order ASC`) as CaseStudy[]
  } catch {
    caseStudies = []
  }

  return (
    <main className="min-h-screen">
      <MTHeader />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Our <span className="text-[#a3e635]">Work</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Real results for real businesses. See how we have helped brands transform their digital presence.
            </p>
          </div>

          {/* Case Studies Grid */}
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study) => (
                <div key={study.id} className="group glass-border rounded-2xl overflow-hidden hover:scale-[1.02] transition-all">
                  <div className="aspect-video bg-white/5 relative">
                    {study.cover_image && (
                      <img src={study.cover_image || "/placeholder.svg"} alt={study.title_en || ""} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs text-[#a3e635] font-medium uppercase tracking-wider">{study.category}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{study.title_en}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.desc_en}</p>
                    {study.client_name && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Client: <span className="text-foreground">{study.client_name}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <p className="text-muted-foreground">Case studies coming soon.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#a3e635] text-black font-semibold rounded-full hover:bg-[#bef264] transition-all"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
