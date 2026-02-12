import Link from "next/link"

const footerLinks = {
  Services: [
    { label: "AI Store Builder", href: "/builder" },
    { label: "Ad Campaigns", href: "/services/ad-campaigns" },
    { label: "Account Management", href: "/services/account-management" },
    { label: "All Services", href: "/services" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "Team", href: "/team" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Help Center", href: "/faq" },
    { label: "FAQ", href: "/faq" },
    { label: "Portal", href: "/portal" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/t&c" },
    { label: "Privacy Policy", href: "/t&c" },
    { label: "Cookie Policy", href: "/t&c" },
  ],
}

export default function MTFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                <span className="text-black font-black text-sm">MT</span>
              </div>
              <span className="text-white font-bold">Media Trend</span>
            </Link>
            <p className="text-sm text-white/25 leading-relaxed mb-2">
              Building the future of e-commerce, one store at a time.
            </p>
            <p className="text-xs text-white/15" dir="rtl">
              نبني مستقبل التجارة الإلكترونية، متجر تلو الآخر
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-white/50 mb-4 uppercase tracking-widest">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/25 hover:text-lime-400/70 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            {new Date().getFullYear()} Media Trend. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/t&c" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Terms
            </Link>
            <Link href="/t&c" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
