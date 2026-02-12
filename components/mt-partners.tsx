"use client"

const row1 = ["Shopify", "Stripe", "Google Cloud", "AWS", "Meta", "Cloudflare", "Twilio", "SendGrid"]
const row2 = ["Intercom", "Zendesk", "HubSpot", "Mailchimp", "Slack", "Notion", "Figma", "Vercel"]

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const tripled = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}>
        <div className="flex gap-12 w-max">
          {tripled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-white/20 hover:text-white/60 transition-colors text-sm font-medium tracking-widest uppercase whitespace-nowrap py-4"
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
  return (
    <section className="py-16 px-4 bg-black border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-white/40 mb-10 uppercase tracking-widest">
          Trusted by Leading Companies
        </p>
        <div className="space-y-2">
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </div>
      </div>
    </section>
  )
}
