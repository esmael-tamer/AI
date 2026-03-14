import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "@/components/layout/client-layout"

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Media Trend | AI-Powered E-Commerce Platform",
  description:
    "Build your dream online store in minutes with our AI assistant. No coding required. Media Trend provides everything you need to launch, manage, and grow your e-commerce business.",
  keywords: ["e-commerce", "online store", "AI", "store builder", "MENA", "media trend"],
  openGraph: {
    title: "Media Trend | AI-Powered E-Commerce Platform",
    description: "Build your dream online store in minutes with our AI assistant.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/icons/favicon-dark.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans bg-black text-white min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
