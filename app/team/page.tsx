import MTHeader from "@/components/mt-header"
import MTFooter from "@/components/mt-footer"
import { sql } from "@/lib/db"
import type { TeamMember } from "@/lib/db"

export const metadata = {
  title: "Our Team | Media Trend",
  description: "Meet the talented team behind Media Trend's AI-powered e-commerce platform.",
}

export default async function TeamPage() {
  let team: TeamMember[] = []
  try {
    team = (await sql`SELECT * FROM team_members ORDER BY sort_order ASC`) as TeamMember[]
  } catch {
    team = []
  }

  return (
    <main className="min-h-screen">
      <MTHeader />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Our <span className="text-[#a3e635]">Team</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Meet the passionate people building the future of e-commerce in the MENA region.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="glass-border-subtle rounded-2xl p-6 text-center group hover:scale-[1.02] transition-all">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/10 mb-4 overflow-hidden">
                  {member.photo_url ? (
                    <img src={member.photo_url || "/placeholder.svg"} alt={member.name_en || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#a3e635]">
                      {(member.name_en || "?")[0]}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name_en}</h3>
                <p className="text-sm text-[#a3e635] mt-1">{member.role_en}</p>
                {member.department && (
                  <span className="inline-block mt-2 text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-white/5">
                    {member.department}
                  </span>
                )}
              </div>
            ))}
          </div>

          {team.length === 0 && (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <p className="text-muted-foreground">Team members coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
