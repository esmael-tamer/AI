"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", labelAr: "الرئيسية" },
  {
    label: "Services",
    labelAr: "الخدمات",
    children: [
      { href: "/services", label: "All Services", labelAr: "جميع الخدمات" },
      { href: "/builder", label: "AI Store Builder", labelAr: "بناء المتاجر" },
      { href: "/services/ad-campaigns", label: "Ad Campaigns", labelAr: "الحملات الإعلانية" },
      { href: "/services/account-management", label: "Account Management", labelAr: "إدارة الحسابات" },
    ],
  },
  { href: "/work", label: "Our Work", labelAr: "أعمالنا" },
  { href: "/team", label: "Team", labelAr: "الفريق" },
  { href: "/blog", label: "Blog", labelAr: "المدونة" },
  { href: "/contact", label: "Contact", labelAr: "تواصل" },
]

export default function MTHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <nav className={`rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-black/40 backdrop-blur-md border border-white/[0.06]"
        }`}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.2)] group-hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] transition-shadow">
              <span className="text-black font-black text-sm">MT</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">Trend</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="px-3.5 py-2 text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5 rounded-xl hover:bg-white/[0.06]">
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 rounded-xl py-2 min-w-[220px] bg-[#111]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <span>{child.label}</span>
                          <span className="text-xs text-white/20">{child.labelAr}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-3.5 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]"
            >
              Login
            </Link>
            <Link
              href="/builder"
              className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-lime-400 to-emerald-400 text-black rounded-full hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all hover:scale-105"
            >
              Start Building
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl p-4 bg-[#111]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      className="w-full text-left px-3 py-3 text-sm text-white/50 hover:text-white flex items-center justify-between rounded-xl hover:bg-white/[0.06]"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-3 border-l border-lime-400/20 pl-3 my-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 text-sm text-white/50 hover:text-white rounded-lg"
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
                    className="px-3 py-3 text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/[0.06]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-center text-white/50 hover:text-white rounded-xl border border-white/10"
              >
                Login
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-center font-semibold bg-gradient-to-r from-lime-400 to-emerald-400 text-black rounded-xl"
              >
                Start Building
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
