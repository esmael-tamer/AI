import { Button } from "@/components/ui/button"
import Image from "next/image"
import LazyVideo from "@/components/lazy-video"

export function HeroProduct() {
  const cta = (
    <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300">
      <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
        Start a project
      </a>
    </Button>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image src="/icons/skitbit-white.svg" alt="Skitbit logo" width={32} height={32} className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.25em] text-lime-300/80">product renders</p>
          </div>

          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">STUDIO‑QUALITY</span>
            <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">3D PRODUCT</span>
            <span className="block">RENDERING</span>
          </h1>

          <p className="mt-4 max-w-2xl text-center text-sm text-white/80 sm:text-base">
            Photorealistic product visuals for e-commerce, ads and brand campaigns — delivered fast, no studio needed.
          </p>

          <div className="mt-6">{cta}</div>

          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {productCards.map((p, i) => {
              const visibility =
                i <= 2 ? "block" : i === 3 ? "hidden md:block" : i === 4 ? "hidden xl:block" : "hidden"
              return (
                <div key={i} className={visibility}>
                  <PhoneCard title={p.title} sub={p.sub} videoSrc={p.videoSrc} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title,
  sub,
  videoSrc,
}: {
  title: string
  sub: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <LazyVideo
          src={
            videoSrc ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay
          loop
          muted
          playsInline
          aria-label={`${title} - ${sub}`}
        />
        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <h3 className="text-3xl font-bold leading-snug text-white/90">{title}</h3>
            <p className="text-xs text-white/70">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-lime-300">
              Skitbit
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const productCards = [
  {
    title: "360°",
    sub: "Full product turntable — every angle covered.",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
  },
  {
    title: "Detail",
    sub: "Macro-close renders that show material quality.",
  },
  {
    title: "Lifestyle",
    sub: "Products placed in aspirational scene environments.",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
  },
  {
    title: "Social",
    sub: "Sized for IG, TikTok & Meta ads.",
  },
  {
    title: "White BG",
    sub: "Clean e-commerce shots, Amazon-ready.",
  },
]
