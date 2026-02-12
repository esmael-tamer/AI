import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function MTCTA() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="rounded-3xl p-10 sm:p-16 relative overflow-hidden bg-[#0a0a0a] border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Ready to Transform
              <br />
              <span className="text-[#a3e635]">Your Business?</span>
            </h2>
            <p className="mt-4 text-lg text-white/40 max-w-lg mx-auto">
              Join thousands of entrepreneurs who launched their stores with Media Trend. Start free, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="group flex items-center gap-2 px-8 py-4 bg-[#a3e635] text-black font-bold rounded-full hover:bg-[#bef264] transition-all hover:scale-105"
              >
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:bg-white/5 transition-all"
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
