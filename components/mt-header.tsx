"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    children: [
      { href: "/builder", label: "AI Store Builder" },
      { href: "/services/ad-campaigns", label: "Ad Campaigns" },
      { href: "/services/account-management", label: "Account Management" },
    ],
  },
  { href: "/work", label: "Our Work" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export default function MTHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <nav className="rounded-2xl px-6 py-3 flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#a3e635] flex items-center justify-center">
              <span className="text-black font-bold text-sm">MT</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Media <span className="text-[#a3e635]">Trend</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 rounded-lg hover:bg-white/5">
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 rounded-xl py-2 min-w-[200px] bg-black/80 backdrop-blur-xl border border-white/10">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
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
                  className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/builder"
              className="px-5 py-2 text-sm font-medium bg-[#a3e635] text-black rounded-full hover:bg-[#bef264] transition-colors"
            >
              Start Building
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl p-4 bg-black/80 backdrop-blur-xl border border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      className="w-full text-left px-3 py-2.5 text-sm text-white/60 hover:text-white flex items-center justify-between rounded-lg hover:bg-white/5"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-3 border-l border-white/10 pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-white/60 hover:text-white"
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
                    className="px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-center text-white/60 hover:text-white rounded-xl border border-white/10"
              >
                Login
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-center font-medium bg-[#a3e635] text-black rounded-xl hover:bg-[#bef264]"
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
