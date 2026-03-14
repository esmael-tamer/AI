"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Send, Check, Loader2, Store, ArrowRight } from "lucide-react"
import { builderSteps, getAIResponse } from "@/lib/builder-engine"
import type { StoreConfig } from "@/types"
import { useLang } from "@/lib/i18n"

type Message = {
  id: string
  role: "ai" | "user"
  content: string
  type?: "text" | "options" | "colors" | "complete"
  options?: { value: string; label: string; labelAr?: string }[]
  field?: string
}

export default function BuilderPage() {
  const router = useRouter()
  const { t, isAr } = useLang()
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

  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const greeting: Message = {
      id: "greeting",
      role: "ai",
      content: isAr
        ? "مرحباً! أنا مساعدك الذكي لبناء المتاجر. سأساعدك في إنشاء متجر إلكتروني احترافي في خطوات بسيطة. هيا نبدأ!"
        : "Welcome! I'm your AI store builder. I'll help you create a professional online store in just a few steps. Let's get started!",
    }
    setMessages([greeting])

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
        content: isAr ? step.questionAr : step.question,
        type: step.type === "select" || step.type === "multi-select" ? "options" : step.type === "color" ? "colors" : "text",
        options: step.options?.map((o) => ({ value: o.value, label: o.label, labelAr: o.labelAr })),
        field: step.field,
      }
      setMessages((prev) => [...prev, questionMessage])
      setIsTyping(false)
      inputRef.current?.focus()
    }, 800)
  }

  function handleAnswer(value: string, displayValue?: string) {
    const step = builderSteps[currentStep]

    const userMessage: Message = {
      id: `a-${step.id}`,
      role: "user",
      content: displayValue || value,
    }
    setMessages((prev) => [...prev, userMessage])

    setStoreConfig((prev) => ({
      ...prev,
      [step.field]: value,
    }))

    setIsTyping(true)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `r-${step.id}`,
        role: "ai",
        content: getAIResponse(step.id, value, isAr),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

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
        content: t(
          "Excellent! I have everything I need. Let me create your store now...",
          "ممتاز! لدي كل ما أحتاجه. دعني أنشئ متجرك الآن..."
        ),
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
            content: t(
              `Your store "${data.store.name}" is ready! I've set up your storefront with sample products, your brand colors, and bilingual support. Click below to preview it.`,
              `متجرك "${data.store.name}" جاهز! قمت بإعداد واجهة متجرك مع منتجات نموذجية وألوان علامتك التجارية ودعم ثنائي اللغة. اضغط أدناه لمعاينته.`
            ),
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
        content: t(
          "I ran into an issue creating your store. Please try again or contact our support team.",
          "واجهت مشكلة في إنشاء متجرك. يرجى المحاولة مرة أخرى أو التواصل مع فريق الدعم."
        ),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsGenerating(false)
    }
  }

  const currentStepData = currentStep < builderSteps.length ? builderSteps[currentStep] : null
  const showTextInput = currentStepData?.type === "text" && !isGenerating
  const progress = Math.min((currentStep / builderSteps.length) * 100, 100)

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              {t("Back", "رجوع")}
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-white">{t("AI Store Builder", "بناء المتاجر الذكي")}</span>
            </div>
            <div className="text-xs text-white/40">
              {currentStep}/{builderSteps.length}
            </div>
          </div>
          <div className="mt-2 mx-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 pt-28 pb-32 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "ai" && (
                <div className="w-9 h-9 rounded-full bg-lime-400/15 border border-lime-400/20 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                </div>
              )}
              <div className={`max-w-md ${msg.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-5 py-3.5 ${
                    msg.role === "user"
                      ? "bg-lime-400/10 border border-lime-400/20 rounded-tr-sm"
                      : "bg-white/[0.06] border border-white/[0.08] rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                </div>

                {msg.type === "options" && msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value, isAr && opt.labelAr ? opt.labelAr : opt.label)}
                        className="px-4 py-2 text-sm font-medium rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:bg-lime-400/10 hover:border-lime-400/20 hover:text-lime-400 transition-all hover:scale-105"
                      >
                        {isAr && opt.labelAr ? opt.labelAr : opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "colors" && msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value, isAr && opt.labelAr ? opt.labelAr : opt.label)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/[0.08] hover:border-white/15 transition-all hover:scale-105"
                      >
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: opt.value }} />
                        {isAr && opt.labelAr ? opt.labelAr : opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "complete" && storeSlug && (
                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      href={`/s/${storeSlug}`}
                      className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-lime-400 text-black font-semibold rounded-xl hover:bg-lime-300 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(163,230,53,0.2)]"
                    >
                      <Store className="w-4 h-4" />
                      {t("View Your Store", "معاينة متجرك")}
                      <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 px-6 py-3 text-sm text-white/70 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all"
                    >
                      {t("Create Account to Manage", "أنشئ حساباً للإدارة")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-lime-400/15 border border-lime-400/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-lime-400" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-3.5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {isGenerating && !isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-lime-400/15 border border-lime-400/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-lime-400" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-4 h-4 text-lime-400 animate-spin" />
                  <span className="text-sm text-white/60">{t("Building your store...", "جاري بناء متجرك...")}</span>
                </div>
                <div className="space-y-2">
                  {[
                    t("Setting up storefront", "إعداد واجهة المتجر"),
                    t("Adding products", "إضافة المنتجات"),
                    t("Configuring payments", "إعداد المدفوعات"),
                    t("Applying brand colors", "تطبيق ألوان العلامة التجارية"),
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-2 text-xs text-white/40" style={{ animationDelay: `${i * 600}ms` }}>
                      <Check className="w-3 h-3 text-lime-400" />
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

      {showTextInput && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent">
          <form onSubmit={handleSubmitText} className="max-w-2xl mx-auto">
            <div className="flex gap-2 items-center bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-xl">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={(isAr ? currentStepData?.placeholderAr : currentStepData?.placeholder) || t("Type your answer...", "اكتب إجابتك...")}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none py-2"
                dir={isAr ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-lime-400 text-black hover:bg-lime-300 transition-colors disabled:opacity-30 disabled:hover:bg-lime-400"
              >
                <Send className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
