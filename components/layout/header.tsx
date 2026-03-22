"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Globe } from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function MTHeader() {
  const { t, lang, setLang, isAr } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Minimal nav links — Visuo style (fewer items, cleaner)
  const navLinks = [
    {
      label: t("Workflow", "طريقة العمل"),
      href: "/#how-it-works",
    },
    {
      label: t("Services", "الخدمات"),
      children: [
        { href: "/builder", label: t("AI Store Builder", "بناء المتاجر") },
        { href: "/services/ad-campaigns", label: t("Ad Campaigns", "الحملات الإعلانية") },
        { href: "/services/account-management", label: t("Account Management", "إدارة الحسابات") },
      ],
    },
    { href: "/work", label: t("Work", "أعمالنا") },
    { href: "/blog", label: t("Articles", "المقالات") },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <nav className={`rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            : "bg-[#050505]/60 backdrop-blur-md border border-white/[0.05]"
        }`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.2)] group-hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] transition-shadow">
              <span className="text-black font-black text-xs">MT</span>
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">Trend</span>
            </span>
          </Link>

          {/* Desktop nav — minimal, centered */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="px-3.5 py-2 text-sm text-white/45 hover:text-white transition-colors flex items-center gap-1 rounded-xl hover:bg-white/[0.05]">
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className={`absolute top-full ${isAr ? "right-0" : "left-0"} mt-2 rounded-xl py-1.5 min-w-[200px] bg-[#0e0e0e]/98 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)]`}>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/45 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-3.5 py-2 text-sm text-white/45 hover:text-white transition-colors rounded-xl hover:bg-white/[0.05]"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white/40 hover:text-white/70 transition-colors rounded-xl hover:bg-white/[0.05]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{isAr ? "EN" : "عربي"}</span>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/45 hover:text-white transition-colors rounded-xl hover:bg-white/[0.05]"
            >
              {t("Login", "دخول")}
            </Link>
            <Link
              href="/builder"
              className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              {t("Get started", "ابدأ الآن")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl p-4 bg-[#0e0e0e]/98 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="w-full text-start px-3 py-3 text-sm text-white/45 hover:text-white flex items-center justify-between rounded-xl hover:bg-white/[0.05]"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className={`${isAr ? "mr-3 border-r pr-3" : "ml-3 border-l pl-3"} border-lime-400/20 my-1`}>
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 text-sm text-white/45 hover:text-white rounded-lg"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 text-sm text-white/45 hover:text-white rounded-xl hover:bg-white/[0.05]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              <button
                onClick={() => { setLang(isAr ? "en" : "ar"); setMobileOpen(false) }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white/45 hover:text-white rounded-xl border border-white/[0.07]"
              >
                <Globe className="w-4 h-4" />
                {isAr ? "Switch to English" : "التبديل للعربية"}
              </button>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-center text-white/45 hover:text-white rounded-xl border border-white/[0.07]"
              >
                {t("Login", "دخول")}
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-center font-semibold bg-white text-black rounded-xl hover:bg-white/90 transition-all"
              >
                {t("Get started", "ابدأ الآن")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
