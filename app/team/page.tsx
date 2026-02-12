"use client"

import { useState, useEffect } from "react"
import MTHeader from "@/components/mt-header"
import MTFooter from "@/components/mt-footer"
import { useLang } from "@/lib/i18n"

interface TeamMember {
  id: number
  name_en: string | null
  name_ar: string | null
  role_en: string | null
  role_ar: string | null
  department: string | null
  photo_url: string | null
  sort_order: number
}

export default function TeamPage() {
  const { t, isAr } = useLang()
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    fetch("/api/admin/team")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeam(data)
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
                <span className="text-[#a3e635]">فريقنا</span>
              ) : (
                <>Our <span className="text-[#a3e635]">Team</span></>
              )}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              {t("Meet the passionate people building the future of e-commerce in the MENA region.", "تعرّف على الأشخاص المتحمسين الذين يبنون مستقبل التجارة الإلكترونية.")}
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="glass-border-subtle rounded-2xl p-6 text-center group hover:scale-[1.02] transition-all">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/10 mb-4 overflow-hidden">
                  {member.photo_url ? (
                    <img src={member.photo_url || "/placeholder.svg"} alt={(isAr ? member.name_ar : member.name_en) || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#a3e635]">
                      {((isAr ? member.name_ar : member.name_en) || "?")[0]}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{isAr ? member.name_ar : member.name_en}</h3>
                <p className="text-sm text-[#a3e635] mt-1">{isAr ? member.role_ar : member.role_en}</p>
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
              <p className="text-muted-foreground">{t("Team members coming soon.", "أعضاء الفريق قريباً.")}</p>
            </div>
          )}
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
