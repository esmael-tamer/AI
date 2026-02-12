import Link from "next/link"

const footerLinks = {
  Services: [
    { label: "AI Store Builder", href: "/builder" },
    { label: "Ad Campaigns", href: "/services/ad-campaigns" },
    { label: "Account Management", href: "/services/account-management" },
    { label: "Smart Analytics", href: "/services/analytics" },
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
    { label: "Status", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/t&c" },
    { label: "Privacy Policy", href: "/t&c" },
    { label: "Cookie Policy", href: "/t&c" },
  ],
}

export default function MTFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#a3e635] flex items-center justify-center">
                <span className="text-black font-bold text-sm">MT</span>
              </div>
              <span className="text-white font-semibold">Media Trend</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              Building the future of e-commerce, one store at a time.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            {new Date().getFullYear()} Media Trend. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/t&c" className="text-xs text-white/40 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/t&c" className="text-xs text-white/40 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
