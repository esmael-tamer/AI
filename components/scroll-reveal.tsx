"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variant?: "up" | "left" | "right" | "scale"
  delay?: number
}

export default function ScrollReveal({ children, className = "", variant = "up", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible")
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const revealClass = variant === "up" ? "reveal" :
    variant === "left" ? "reveal-left" :
    variant === "right" ? "reveal-right" : "reveal-scale"

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : ""

  return (
    <div ref={ref} className={`${revealClass} ${delayClass} ${className}`}>
      {children}
    </div>
  )
}
