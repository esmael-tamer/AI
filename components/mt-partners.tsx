"use client"

const partners = [
  "Shopify", "Stripe", "Google Cloud", "AWS", "Meta", "Vercel",
  "Cloudflare", "Twilio", "SendGrid", "Intercom",
]

export default function MTPartners() {
  return (
    <section className="py-16 px-4 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by leading companies and powered by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors text-sm font-medium tracking-wider uppercase"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
