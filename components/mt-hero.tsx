"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Store, TrendingUp, Star } from "lucide-react"
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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-border-subtle mb-8">
          <Sparkles className="w-4 h-4 text-[#a3e635]" />
          <span className="text-xs font-medium text-muted-foreground">AI-Powered E-Commerce Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
          <span className="text-balance">Build Your Dream</span>
          <br />
          <span className="text-[#a3e635]">{currentText}</span>
          <span className="animate-pulse text-[#a3e635]">|</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Our AI assistant guides you through creating a professional online store.
          No coding required. Just answer a few questions and watch your store come to life.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/builder"
            className="group flex items-center gap-2 px-8 py-3.5 bg-[#a3e635] text-black font-semibold rounded-full hover:bg-[#bef264] transition-all hover:scale-105"
          >
            Start Building Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/work"
            className="flex items-center gap-2 px-8 py-3.5 text-foreground font-medium rounded-full glass-border hover:bg-white/10 transition-all"
          >
            View Our Work
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-border-subtle rounded-2xl p-5 text-center">
              <stat.icon className="w-5 h-5 text-[#a3e635] mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating AI Chat Preview */}
        <div className="mt-16 max-w-lg mx-auto glass-border rounded-2xl p-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
            <span className="text-xs text-muted-foreground">AI Store Builder</span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
              </div>
              <div className="glass-border-subtle rounded-xl rounded-tl-sm px-4 py-2.5">
                <p className="text-sm text-foreground">{"What type of store would you like to build today?"}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-xl rounded-tr-sm px-4 py-2.5">
                <p className="text-sm text-foreground">{"I want to create a fashion store for women's clothing"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
              </div>
              <div className="glass-border-subtle rounded-xl rounded-tl-sm px-4 py-2.5">
                <p className="text-sm text-muted-foreground">{"Great choice! Let me set that up for you. What would you like to name your store?"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
