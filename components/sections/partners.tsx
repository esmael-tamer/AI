"use client"

import Image from "next/image"
import { useLang } from "@/lib/i18n"
import ScrollReveal from "@/components/ui/scroll-reveal"

const logos = [
  { src: "/images/partners/knet.jpeg", alt: "KNET" },
  { src: "/images/partners/visa.jpeg", alt: "Visa" },
  { src: "/images/partners/applepay.jpeg", alt: "Apple Pay" },
  { src: "/images/partners/tap.jpeg", alt: "Tap" },
  { src: "/images/partners/myfatoorah.jpeg", alt: "MyFatoorah" },
  { src: "/images/partners/payments.jpeg", alt: "Payments" },
  { src: "/images/partners/google.jpeg", alt: "Google" },
  { src: "/images/partners/meta.avif", alt: "Meta" },
  { src: "/images/partners/mada.jpeg", alt: "Mada" },
  { src: "/images/partners/precedence.png", alt: "Precedence" },
  { src: "/images/partners/leswaq.jpeg", alt: "Leswaq" },
]

function MarqueeTrack({ items, reverse = false }: { items: typeof logos; reverse?: boolean }) {
  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={`flex w-max gap-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="flex items-center justify-center shrink-0 w-[100px] h-[50px] rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-2 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={80}
              height={35}
              style={{ width: "auto", height: "auto" }}
              className="object-contain max-w-[80px] max-h-[35px] opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            />
          </div>
        ))}
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
        <ScrollReveal>
          <p className="text-center text-xs text-white/25 mb-10 uppercase tracking-[0.3em] font-medium">
            {t("Direct Integration with Multiple Systems", "تكامل مباشر مع أنظمة متعددة")}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <div className="space-y-4">
            <MarqueeTrack items={logos} />
            <MarqueeTrack items={[...logos].reverse()} reverse />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
