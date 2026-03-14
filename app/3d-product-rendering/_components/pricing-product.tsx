"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

const ACCENT = "#C6FF3A"

export function PricingProduct() {
  return (
    <section id="pricing" className="text-white">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", border: `1px solid ${ACCENT}` }}
          >
            Transparent pricing for product renders
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Packages.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-300">
            Fixed prices, fast turnarounds and unlimited revisions until you love it.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="rounded-full px-5 text-neutral-900 hover:brightness-95"
              style={{ backgroundColor: "#f2f2f2" }}
            >
              <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
                Contact now
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Still Shot */}
          <Card className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
            <CardHeader className="space-y-3 pb-4">
              <h3 className="text-sm font-semibold text-neutral-100">Still Shot</h3>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight">$149</div>
                <span className="pb-0.5 text-[11px] text-neutral-300">per image</span>
              </div>
              <Button
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: "#0a0a0a", color: "#ffffff", border: "1px solid #333" }}
                asChild
              >
                <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
                  Order Now
                </a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2">
                {[
                  "1 hero angle",
                  "White or gradient background",
                  "Photoreal materials & lighting",
                  "1 revision",
                  "Delivered in 48 hours",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
                    <span className="text-sm text-neutral-100">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Lifestyle Pack */}
          <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced shadow-[0_16px_50px_rgba(0,0,0,0.4)] transition-all duration-300 scale-[1.02]">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-black"
              style={{ backgroundColor: ACCENT }}
            >
              Most Popular
            </div>
            <CardHeader className="space-y-3 pb-4">
              <h3 className="text-sm font-semibold text-neutral-100">Lifestyle Pack</h3>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight">$349</div>
                <span className="pb-0.5 text-[11px] text-neutral-300">3 images</span>
              </div>
              <Button
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: ACCENT, color: "#000" }}
                asChild
              >
                <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
                  Order Now
                </a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2">
                {[
                  "3 camera angles",
                  "Lifestyle or scene background",
                  "Photoreal materials & lighting",
                  "3 revisions",
                  "Delivered in 72 hours",
                  "Social-ready crops included",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
                    <span className="text-sm text-neutral-100">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Brand Campaign */}
          <Card className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
            <CardHeader className="space-y-3 pb-4">
              <h3 className="text-sm font-semibold text-neutral-100">Brand Campaign</h3>
              <div className="flex items-end gap-2 text-white">
                <div className="text-xl font-bold tracking-tight">Custom</div>
                <span className="pb-0.5 text-[11px] text-neutral-300">quote</span>
              </div>
              <Button
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: "#0a0a0a", color: "#ffffff", border: "1px solid #333" }}
                asChild
              >
                <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
                  Get a Quote
                </a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid gap-2">
                {[
                  "Unlimited shots",
                  "360° turntable animation",
                  "Multiple colorways",
                  "Brand guidelines applied",
                  "Priority 24-hour delivery",
                  "Dedicated account manager",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
                    <span className="text-sm text-neutral-100">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>
        </div>
      </div>
    </section>
  )
}
