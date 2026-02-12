"use client"

import { useLang } from "@/lib/i18n"

const row1 = ["Shopify", "Stripe", "Google Cloud", "AWS", "Meta", "Cloudflare", "Twilio", "SendGrid"]
const row2 = ["Intercom", "Zendesk", "HubSpot", "Mailchimp", "Slack", "Notion", "Figma", "Vercel"]

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const tripled = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}>
        <div className="flex gap-16 w-max">
          {tripled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-white/15 hover:text-lime-400/40 transition-colors duration-500 text-sm font-medium tracking-[0.2em] uppercase whitespace-nowrap py-5"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MTPartners() {
  const { t } = useLang()

  return (
    <section className="py-20 px-4 bg-[#0a0a0a] border-y border-white/[0.04] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-400/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <p className="text-center text-xs text-white/25 mb-12 uppercase tracking-[0.3em] font-medium">
          {t("Trusted by Leading Companies", "موثوق من قبل الشركات الرائدة")}
        </p>
        <div className="space-y-2">
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </div>
      </div>
    </section>
  )
}
