"use client"

import Link from "next/link"
import { ArrowRight, Store, TrendingUp, Star, Zap } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  { icon: Store, value: "2,500+", label: "Stores Created", labelAr: "متجر تم إنشاؤه" },
  { icon: TrendingUp, value: "$12M+", label: "Revenue Generated", labelAr: "إيرادات محققة" },
  { icon: Star, value: "98%", label: "Satisfaction Rate", labelAr: "نسبة الرضا" },
]

const typingWords = ["Fashion Store", "Electronics Shop", "Restaurant Menu", "Beauty Brand", "Bookstore"]

export default function MTHero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentText, setCurrentText] = useState("")

  useEffect(() => {
    const word = typingWords[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(word.substring(0, charIndex + 1))
          setCharIndex((prev) => prev + 1)
          if (charIndex + 1 === word.length) {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        } else {
          setCurrentText(word.substring(0, charIndex - 1))
          setCharIndex((prev) => prev - 1)
          if (charIndex - 1 === 0) {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % typingWords.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-20 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-lime-400/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-400/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-400/[0.03] rounded-full blur-[200px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(rgba(163, 230, 53, 0.06) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/20 mb-10 backdrop-blur-sm">
          <Zap className="w-4 h-4 text-lime-400" />
          <span className="text-lime-400 text-sm font-medium">AI-Powered Platform</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9]">
          <span className="block">AI-POWERED</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-300">E-COMMERCE</span>
          <span className="block">FOR BRANDS</span>
        </h1>

        <div className="mt-10 text-lg sm:text-xl md:text-2xl text-white/50">
          Build your{" "}
          <span className="text-lime-400 font-semibold">{currentText}</span>
          <span className="animate-pulse text-lime-400">|</span>
          {" "}in minutes
        </div>

        <p className="mt-4 text-base text-white/30 max-w-xl mx-auto leading-relaxed">
          Our AI assistant guides you through creating a professional online store.
          No coding required. Just answer a few questions and watch your store come to life.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/builder"
            className="group flex items-center gap-2 px-10 py-4 bg-lime-400 text-black font-bold text-lg rounded-full hover:bg-lime-300 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.3)]"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/work"
            className="flex items-center gap-2 px-10 py-4 text-white font-medium text-lg rounded-full border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all backdrop-blur-sm"
          >
            View Our Work
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="group rounded-2xl p-6 text-center bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
              <stat.icon className="w-5 h-5 text-lime-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              <div className="text-xs text-white/20 mt-0.5" dir="rtl">{stat.labelAr}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
