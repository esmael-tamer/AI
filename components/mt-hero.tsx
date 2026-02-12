"use client"

import Link from "next/link"
import { ArrowRight, Store, TrendingUp, Star } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  { icon: Store, value: "2,500+", label: "Stores Created" },
  { icon: TrendingUp, value: "$12M+", label: "Revenue Generated" },
  { icon: Star, value: "98%", label: "Satisfaction Rate" },
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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-20 bg-black">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9]">
          <span className="block">AI-POWERED</span>
          <span className="block text-[#a3e635]">E-COMMERCE</span>
          <span className="block">FOR BRANDS</span>
        </h1>

        <div className="mt-8 text-lg sm:text-xl md:text-2xl text-white/60">
          Build your{" "}
          <span className="text-[#a3e635] font-semibold">{currentText}</span>
          <span className="animate-pulse text-[#a3e635]">|</span>
          {" "}in minutes
        </div>

        <p className="mt-4 text-base text-white/40 max-w-xl mx-auto">
          Our AI assistant guides you through creating a professional online store.
          No coding required. Just answer a few questions and watch your store come to life.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/builder"
            className="group flex items-center gap-2 px-8 py-4 bg-[#a3e635] text-black font-bold text-lg rounded-full hover:bg-[#bef264] transition-all hover:scale-105"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/work"
            className="flex items-center gap-2 px-8 py-4 text-white font-medium text-lg rounded-full border border-white/20 hover:bg-white/5 transition-all"
          >
            View Our Work
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-border-subtle rounded-2xl p-6 text-center">
              <stat.icon className="w-5 h-5 text-[#a3e635] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
