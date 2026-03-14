"use client"

import Header from "@/components/layout/header"
import Hero from "@/components/sections/hero"
import HowItWorks from "@/components/sections/how-it-works"
import Services from "@/components/sections/services"
import Partners from "@/components/sections/partners"
import { Pricing } from "@/components/sections/pricing"
import FAQ from "@/components/sections/faq"
import CTA from "@/components/sections/cta"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <HowItWorks />
      <Services />
      <Partners />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
