"use client"

import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import FAQ from "@/components/sections/faq"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />
      <div className="pt-24">
        <FAQ />
      </div>
      <MTFooter />
    </main>
  )
}
