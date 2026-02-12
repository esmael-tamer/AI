"use client"

import Image from "next/image"
import { useLang } from "@/lib/i18n"

const row1 = [
  { src: "/images/partners/knet.jpeg", alt: "KNET" },
  { src: "/images/partners/visa.jpeg", alt: "Visa" },
  { src: "/images/partners/applepay.jpeg", alt: "Apple Pay" },
  { src: "/images/partners/tap.jpeg", alt: "Tap" },
  { src: "/images/partners/myfatoorah.jpeg", alt: "MyFatoorah" },
  { src: "/images/partners/payments.jpeg", alt: "Payments" },
]

const row2 = [
  { src: "/images/partners/google.jpeg", alt: "Google" },
  { src: "/images/partners/meta.avif", alt: "Meta" },
  { src: "/images/partners/mada.jpeg", alt: "Mada" },
  { src: "/images/partners/precedence.png", alt: "Precedence" },
  { src: "/images/partners/leswaq.jpeg", alt: "Leswaq" },
]

function MarqueeRow({ items, direction }: { items: typeof row1; direction: "left" | "right" }) {
  const tripled = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}>
        <div className="flex gap-16 w-max">
          {tripled.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex items-center justify-center whitespace-nowrap py-5"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
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
          {t("Our Partners & Payment Platforms", "شركاؤنا ومنصات الدفع")}
        </p>
        <div className="space-y-2">
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </div>
      </div>
    </section>
  )
}
