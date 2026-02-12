"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Send, Check, Loader2, Store, ArrowRight } from "lucide-react"
import { builderSteps, getAIResponse } from "@/lib/builder-engine"
import type { StoreConfig } from "@/lib/builder-engine"

type Message = {
  id: string
  role: "ai" | "user"
  content: string
  type?: "text" | "options" | "colors" | "complete"
  options?: { value: string; label: string }[]
  field?: string
}

export default function BuilderPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [storeConfig, setStoreConfig] = useState<Partial<StoreConfig>>({})
  const [storeSlug, setStoreSlug] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: "greeting",
      role: "ai",
      content: "Welcome! I'm your AI store builder. I'll help you create a professional online store in just a few steps. Let's get started!",
    }
    setMessages([greeting])

    // Show first question after delay
    setTimeout(() => {
      showQuestion(0)
    }, 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function showQuestion(stepIndex: number) {
    if (stepIndex >= builderSteps.length) {
      generateStore()
      return
    }

    const step = builderSteps[stepIndex]
    setIsTyping(true)

    setTimeout(() => {
      const questionMessage: Message = {
        id: `q-${step.id}`,
        role: "ai",
        content: step.question,
        type: step.type === "select" || step.type === "multi-select" ? "options" : step.type === "color" ? "colors" : "text",
        options: step.options?.map((o) => ({ value: o.value, label: o.label })),
        field: step.field,
      }
      setMessages((prev) => [...prev, questionMessage])
      setIsTyping(false)
      inputRef.current?.focus()
    }, 800)
  }

  function handleAnswer(value: string, displayValue?: string) {
    const step = builderSteps[currentStep]

    // Add user message
    const userMessage: Message = {
      id: `a-${step.id}`,
      role: "user",
      content: displayValue || value,
    }
    setMessages((prev) => [...prev, userMessage])

    // Update store config
    setStoreConfig((prev) => ({
      ...prev,
      [step.field]: value,
    }))

    // Show AI response
    setIsTyping(true)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `r-${step.id}`,
        role: "ai",
        content: getAIResponse(step.id, value),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      // Move to next step
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setTimeout(() => showQuestion(nextStep), 600)
    }, 600)

    setInput("")
  }

  function handleSubmitText(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    handleAnswer(input.trim())
  }

  async function generateStore() {
    setIsGenerating(true)
    setIsTyping(true)

    setTimeout(() => {
      const generatingMessage: Message = {
        id: "generating",
        role: "ai",
        content: "Excellent! I have everything I need. Let me create your store now...",
      }
      setMessages((prev) => [...prev, generatingMessage])
      setIsTyping(false)
    }, 500)

    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeConfig),
      })
      const data = await res.json()

      if (data.success) {
        setStoreSlug(data.store.slug)
        setTimeout(() => {
          const completeMessage: Message = {
            id: "complete",
            role: "ai",
            content: `Your store "${data.store.name}" is ready! I've set up your storefront with sample products, your brand colors, and bilingual support. Click below to preview it.`,
            type: "complete",
          }
          setMessages((prev) => [...prev, completeMessage])
          setIsGenerating(false)
        }, 2500)
      } else {
        throw new Error(data.error)
      }
    } catch {
      const errorMessage: Message = {
        id: "error",
        role: "ai",
        content: "I ran into an issue creating your store. Please try again or contact our support team.",
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsGenerating(false)
    }
  }

  const currentStepData = currentStep < builderSteps.length ? builderSteps[currentStep] : null
  const showTextInput = currentStepData?.type === "text" && !isGenerating
  const progress = Math.min((currentStep / builderSteps.length) * 100, 100)

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <div className="liquid-glass-header rounded-2xl px-5 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a3e635]" />
              <span className="text-sm font-medium text-foreground">AI Store Builder</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentStep}/{builderSteps.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 mx-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#a3e635] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 pt-28 pb-32 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-[#a3e635]" />
                </div>
              )}
              <div className={`max-w-md ${msg.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-tr-sm"
                      : "glass-border-subtle rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                </div>

                {/* Options */}
                {msg.type === "options" && msg.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value, opt.label)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full glass-border-subtle hover:bg-white/10 text-foreground transition-all hover:scale-105"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Color Options */}
                {msg.type === "colors" && msg.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value, opt.label)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full glass-border-subtle hover:bg-white/10 text-foreground transition-all hover:scale-105"
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: opt.value }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Complete - View Store */}
                {msg.type === "complete" && storeSlug && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href={`/s/${storeSlug}`}
                      className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#a3e635] text-black font-semibold rounded-xl hover:bg-[#bef264] transition-all"
                    >
                      <Store className="w-4 h-4" />
                      View Your Store
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 px-6 py-3 text-sm text-foreground glass-border rounded-xl hover:bg-white/10 transition-all"
                    >
                      Create Account to Manage
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="glass-border-subtle rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Generating indicator */}
          {isGenerating && !isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="glass-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#a3e635] animate-spin" />
                  <span className="text-sm text-muted-foreground">Building your store...</span>
                </div>
                <div className="mt-2 space-y-1">
                  {["Setting up storefront", "Adding products", "Configuring payments", "Applying brand colors"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground" style={{ animationDelay: `${i * 600}ms` }}>
                      <Check className="w-3 h-3 text-[#a3e635]" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {showTextInput && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <form onSubmit={handleSubmitText} className="max-w-2xl mx-auto">
            <div className="flex gap-2 items-center glass-border rounded-2xl px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentStepData?.placeholder || "Type your answer..."}
                className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none py-2"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-[#a3e635] text-black hover:bg-[#bef264] transition-colors disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
