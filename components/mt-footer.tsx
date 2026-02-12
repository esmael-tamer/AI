"use client"

import Link from "next/link"
import { useLang } from "@/lib/i18n"

export default function MTFooter() {
  const { t } = useLang()

  const footerLinks = {
    [t("Services", "الخدمات")]: [
      { label: t("AI Store Builder", "بناء المتاجر بالذكاء الاصطناعي"), href: "/builder" },
      { label: t("Ad Campaigns", "الحملات الإعلانية"), href: "/services/ad-campaigns" },
      { label: t("Account Management", "إدارة الحسابات"), href: "/services/account-management" },
      { label: t("All Services", "جميع الخدمات"), href: "/services" },
    ],
    [t("Company", "الشركة")]: [
      { label: t("About Us", "من نحن"), href: "/about" },
      { label: t("Our Work", "أعمالنا"), href: "/work" },
      { label: t("Team", "الفريق"), href: "/team" },
      { label: t("Blog", "المدونة"), href: "/blog" },
    ],
    [t("Support", "الدعم")]: [
      { label: t("Contact Us", "تواصل معنا"), href: "/contact" },
      { label: t("Help Center", "مركز المساعدة"), href: "/faq" },
      { label: t("FAQ", "الأسئلة الشائعة"), href: "/faq" },
      { label: t("Portal", "البوابة"), href: "/portal" },
    ],
    [t("Legal", "قانوني")]: [
      { label: t("Terms of Service", "شروط الخدمة"), href: "/t&c" },
      { label: t("Privacy Policy", "سياسة الخصوصية"), href: "/t&c" },
      { label: t("Cookie Policy", "سياسة ملفات الارتباط"), href: "/t&c" },
    ],
  }

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
            <p className="text-sm text-white/25 leading-relaxed">
              {t(
                "Building the future of e-commerce, one store at a time.",
                "نبني مستقبل التجارة الإلكترونية، متجر تلو الآخر."
              )}
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
            {new Date().getFullYear()} Media Trend. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/t&c" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              {t("Terms", "الشروط")}
            </Link>
            <Link href="/t&c" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              {t("Privacy", "الخصوصية")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
