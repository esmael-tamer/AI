"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function MTCTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-border-enhanced rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">
              Ready to Transform
              <br />
              <span className="text-[#a3e635]">Your Business?</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto text-pretty">
              Join thousands of entrepreneurs who launched their stores with Media Trend. Start free, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="group flex items-center gap-2 px-8 py-3.5 bg-[#a3e635] text-black font-semibold rounded-full hover:bg-[#bef264] transition-all hover:scale-105"
              >
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 text-foreground font-medium rounded-full glass-border hover:bg-white/10 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
