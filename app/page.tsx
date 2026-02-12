"use client"

import MTHeader from "@/components/mt-header"
import MTHero from "@/components/mt-hero"
import HowItWorks from "@/components/how-it-works"
import MTServices from "@/components/mt-services"
import MTPartners from "@/components/mt-partners"
import { Pricing } from "@/components/pricing"
import FAQ from "@/components/faq"
import MTCTA from "@/components/mt-cta"
import MTFooter from "@/components/mt-footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <MTHeader />
      <MTHero />
      <HowItWorks />
      <MTServices />
      <MTPartners />
      <Pricing />
      <FAQ />
      <MTCTA />
      <MTFooter />
    </main>
  )
}
