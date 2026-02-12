"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Lang = "ar" | "en"

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (en: string, ar: string) => string
  isAr: boolean
  dir: "rtl" | "ltr"
}

const LangContext = createContext<LangContextType>({
  lang: "ar",
  setLang: () => {},
  t: (en) => en,
  isAr: true,
  dir: "rtl",
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar")

  useEffect(() => {
    const saved = localStorage.getItem("mt-lang") as Lang | null
    if (saved && (saved === "ar" || saved === "en")) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("mt-lang", newLang)
  }

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en)
  const isAr = lang === "ar"
  const dir = lang === "ar" ? "rtl" : "ltr" as const

  return (
    <LangContext.Provider value={{ lang, setLang, t, isAr, dir }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
