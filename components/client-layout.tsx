"use client"

import { LanguageProvider, useLang } from "@/lib/i18n"
import { type ReactNode, useEffect } from "react"

function LayoutInner({ children }: { children: ReactNode }) {
  const { dir, lang } = useLang()

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir)
    document.documentElement.setAttribute("lang", lang)
  }, [dir, lang])

  return <>{children}</>
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageProvider>
  )
}
