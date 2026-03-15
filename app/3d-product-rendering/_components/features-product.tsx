"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function FeaturesProduct() {
  return (
    <section id="services" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-2 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Why brands choose us.
      </h2>
      <p className="mb-10 text-center text-white/70">No studio. No photographer. Just stunning results.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="liquid-glass border border-white/20">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-white/80">REALISM</p>
            <h3 className="mt-1 text-xl text-white font-semibold">Physically‑accurate materials & lighting</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                "Ray-traced reflections & refractions",
                "Custom studio lighting setups",
                "Photoreal textures from reference images",
                "Transparent / glass / metal materials",
                "White background or lifestyle scene",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="liquid-glass border border-white/20">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-white/80">CLIENT LOVE</p>
            <h3 className="mt-1 text-xl text-white font-semibold">
              "Our conversion rate jumped 40% after switching to Skitbit renders."
            </h3>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-4">
              <div className="text-5xl font-bold text-lime-300">4.9</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-lime-300 text-lime-300" />
                ))}
              </div>
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                "Delivered in 48–72 hours",
                "Unlimited product categories",
                "Revisions included",
                "Source files available on request",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
