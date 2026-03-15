"use client"

import type { Store, Product } from "@/types"
import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingCart,
  Search,
  Heart,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  Globe,
  Tag,
  Truck,
  RotateCcw,
  Shield,
  Zap,
  Star,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type CartItem = { product: Product; quantity: number }

// ─── Constants ────────────────────────────────────────────────────────────────
const MENA = ["SA", "AE", "EG", "KW", "BH", "QA", "OM", "JO"]

const HERO_IMAGES: Record<string, string> = {
  perfumes:  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&q=85",
  fashion:   "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85",
  shoes:     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=85",
  skincare:  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=85",
  beauty:    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=85",
  food:      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=85",
  electronics:"https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&q=85",
  home:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85",
  sports:    "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1400&q=85",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function t(en: string, ar: string, isAr: boolean) { return isAr ? ar : en }

function getImg(p: Product): string | null {
  const imgs = p.images
  return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null
}

function getName(p: Product, isAr: boolean) {
  return isAr ? (p.name_ar || p.name_en || "") : (p.name_en || p.name_ar || "")
}

function getDesc(p: Product, isAr: boolean) {
  return isAr ? (p.desc_ar || p.desc_en || "") : (p.desc_en || p.desc_ar || "")
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DemoStorefront({ store, products }: { store: Store; products: Product[] }) {
  const config   = (store.store_config || {}) as Record<string, string>
  const accent   = config.themeColor || "#b8860b"
  const currency = config.currency   || "USD"
  const country  = config.country    || ""

  const defaultAr = MENA.includes(country)
  const [isAr,        setIsAr]        = useState(defaultAr)
  const [cart,        setCart]        = useState<CartItem[]>([])
  const [cartOpen,    setCartOpen]    = useState(false)
  const [selectedProduct, setSelected] = useState<Product | null>(null)
  const [activeCat,   setActiveCat]   = useState("all")
  const [searchQ,     setSearchQ]     = useState("")
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [wishlist,    setWishlist]    = useState<Set<number>>(new Set())
  const [qty,         setQty]         = useState(1)
  const [menuOpen,    setMenuOpen]    = useState(false)

  const dir = isAr ? "rtl" : "ltr"

  const storeName = isAr
    ? (store.name_ar || store.name_en || "متجر")
    : (store.name_en || store.name_ar || "Store")

  const storeDesc = isAr
    ? (config.descriptionAr || config.description || "")
    : (config.description    || "")

  // Infer dominant category for hero
  const dominantCat = useMemo(() => {
    if (!products.length) return "general"
    // Map sub-categories back to main
    const catMap: Record<string, string> = {
      عطور: "perfumes", fragrances: "perfumes", بخور: "perfumes",
      عباءات: "fashion", فساتين: "fashion", ملابس: "fashion", حقائب: "fashion", إكسسوارات: "fashion", بنطلونات: "fashion",
      "كعب عالي": "shoes", سنيكر: "shoes", لوفر: "shoes", بوت: "shoes", صندل: "shoes", ميول: "shoes",
      سيروم: "skincare", كريم: "skincare", مرطب: "skincare", قناع: "skincare", "واقي شمس": "skincare", "زيت الجسم": "skincare",
    }
    const first = products[0].category || ""
    return catMap[first] || Object.keys(HERO_IMAGES).find(k => products.some(p => (p.category || "").toLowerCase().includes(k))) || "fashion"
  }, [products])

  const heroImg = HERO_IMAGES[dominantCat] || HERO_IMAGES.fashion

  // Categories derived from products
  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products])

  // Filtered products
  const filtered = useMemo(() => {
    let list = activeCat === "all" ? products : products.filter(p => p.category === activeCat)
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase()
      list = list.filter(p =>
        p.name_en?.toLowerCase().includes(q) ||
        p.name_ar?.includes(searchQ) ||
        (p.category || "").toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeCat, searchQ])

  // Cart helpers
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  function addToCart(p: Product, q = 1) {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id)
      return ex
        ? prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + q } : i)
        : [...prev, { product: p, quantity: q }]
    })
  }

  function updateQty(id: number, delta: number) {
    setCart(prev =>
      prev.map(i => i.product.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
          .filter(i => i.quantity > 0)
    )
  }

  function toggleWish(id: number) {
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function openProduct(p: Product) { setSelected(p); setQty(1) }

  function fmt(amount: number) {
    return new Intl.NumberFormat(isAr ? "ar" : "en", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div dir={dir} className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] font-[system-ui,_'Segoe_UI',_Tahoma,_Arial,_sans-serif]">

      {/* ── Powered-by bar ─────────────────────────────────────────────────── */}
      <div className="bg-[#1a1a1a] text-center py-1.5 px-4">
        <p className="text-[11px] text-white/50">
          {t("Demo store powered by", "متجر تجريبي مدعوم من", isAr)}{" "}
          <Link href="/" className="underline" style={{ color: accent }}>Media Trend</Link>
          {" · "}
          <Link href="/builder" className="underline" style={{ color: accent }}>
            {t("Build yours free", "أنشئ متجرك مجاناً", isAr)}
          </Link>
        </p>
      </div>

      {/* ── Promo bar ──────────────────────────────────────────────────────── */}
      <div className="text-center py-2 px-4 text-sm font-medium" style={{ backgroundColor: accent + "18", color: accent }}>
        🎁 {t("Free shipping on orders above 150 SAR · Code: WELCOME10", "شحن مجاني للطلبات فوق 150 ريال · كود: WELCOME10", isAr)}
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#eee] shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 text-[#555] hover:text-[#1a1a1a]"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo + name */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: accent }}
            >
              {storeName[0]}
            </div>
            <span className="font-bold text-base leading-tight line-clamp-1">{storeName}</span>
          </div>

          {/* Desktop nav - categories */}
          <nav className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <button
              onClick={() => setActiveCat("all")}
              className="text-sm transition-colors"
              style={{ color: activeCat === "all" ? accent : "#555", fontWeight: activeCat === "all" ? 700 : 400 }}
            >
              {t("All", "الكل", isAr)}
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="text-sm transition-colors"
                style={{ color: activeCat === cat ? accent : "#555", fontWeight: activeCat === cat ? 700 : 400 }}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ms-auto">
            {/* Language */}
            <button
              onClick={() => setIsAr(!isAr)}
              className="p-2 text-[#777] hover:text-[#1a1a1a] text-xs font-semibold flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? "EN" : "ع"}</span>
            </button>

            {/* Country badge */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-[#f5f5f5] text-xs font-medium text-[#555]">
              {country || "INTL"}
              <ChevronLeft className="w-3 h-3" />
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#777] hover:text-[#1a1a1a]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-[#777] hover:text-[#1a1a1a]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: accent }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[#eee] px-4 py-2 bg-white">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-[#aaa]" />
              <input
                type="search"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                autoFocus
                placeholder={t("Search products...", "ابحث عن منتج...", isAr)}
                className="w-full bg-[#f7f7f7] border border-[#e5e5e5] rounded-full ps-9 pe-4 py-2 text-sm focus:outline-none focus:border-[#ccc]"
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#eee] bg-white px-4 py-3 flex flex-wrap gap-3">
            <button
              onClick={() => { setActiveCat("all"); setMenuOpen(false) }}
              className="text-sm font-medium px-3 py-1.5 rounded-full"
              style={{ backgroundColor: activeCat === "all" ? accent : "#f5f5f5", color: activeCat === "all" ? "#fff" : "#555" }}
            >
              {t("All", "الكل", isAr)}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setMenuOpen(false) }}
                className="text-sm font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: activeCat === cat ? accent : "#f5f5f5", color: activeCat === cat ? "#fff" : "#555" }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: 480 }}>
        <Image
          src={heroImg}
          alt={storeName}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Text */}
        <div className={`absolute bottom-0 ${isAr ? "right-0 text-right pr-6" : "left-0 text-left pl-6"} pb-8 max-w-lg`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg">
            {storeName}
          </h1>
          {storeDesc && (
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed line-clamp-2 drop-shadow">
              {storeDesc}
            </p>
          )}
          <button
            onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-lg transition hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            {t("Shop Now", "تسوق الآن", isAr)}
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Slider dots (decorative) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </section>

      {/* ── Trust badges ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#eee]">
        <div className="max-w-screen-lg mx-auto px-4 py-3 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Truck, en: "Fast Delivery", ar: "توصيل سريع" },
            { icon: Shield, en: "Secure Payment", ar: "دفع آمن" },
            { icon: RotateCcw, en: "Easy Returns", ar: "إرجاع سهل" },
          ].map(b => (
            <div key={b.en} className="flex flex-col items-center gap-1">
              <b.icon className="w-4 h-4" style={{ color: accent }} />
              <span className="text-[11px] text-[#666]">{t(b.en, b.ar, isAr)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Tiles ─────────────────────────────────────────────────── */}
      {categories.length > 1 && (
        <section className="py-6 px-4 bg-[#fafaf8]">
          <div className="max-w-screen-lg mx-auto">
            <div className={`flex items-center justify-between mb-4 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className={isAr ? "text-right" : ""}>
                <h2 className="text-lg font-black">{t("Categories", "الفئات", isAr)}</h2>
                <p className="text-xs text-[#888]">{t("Browse our collection", "تصفح تشكيلتنا", isAr)}</p>
              </div>
              <button
                onClick={() => setActiveCat("all")}
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: accent }}
              >
                {t("View All", "عرض الكل", isAr)}
                {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5 rotate-180" />}
              </button>
            </div>

            {/* Horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {categories.map(cat => {
                // Use first product of this category as the tile image
                const catProduct = products.find(p => p.category === cat)
                const catImg = catProduct ? getImg(catProduct) : null
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`relative shrink-0 snap-start rounded-2xl overflow-hidden transition-all hover:scale-105 ${activeCat === cat ? "ring-2 ring-offset-2" : ""}`}
                    style={{
                      width: 130,
                      height: 160,
                      ringColor: accent,
                    } as React.CSSProperties}
                  >
                    {catImg ? (
                      <Image src={catImg} alt={cat} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: accent + "20" }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-0 inset-x-0 pb-3 text-center text-white text-sm font-bold px-2 leading-tight">
                      {cat}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Products Grid ──────────────────────────────────────────────────── */}
      <section id="products-section" className="py-6 px-4 bg-[#fafaf8]">
        <div className="max-w-screen-lg mx-auto">
          <div className={`flex items-end justify-between mb-5 ${isAr ? "flex-row-reverse" : ""}`}>
            <div className={isAr ? "text-right" : ""}>
              <h2 className="text-xl font-black">{t("Featured Products", "منتجات مميزة", isAr)}</h2>
              <p className="text-xs text-[#888] mt-0.5">{t("Handpicked just for you", "مختارة بعناية لك", isAr)}</p>
            </div>
            <span className="text-xs text-[#999]">
              {filtered.length} {t("items", "منتج", isAr)}
            </span>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(product => {
              const img = getImg(product)
              const wished = wishlist.has(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openProduct(product)}
                >
                  {/* Image */}
                  <div className="relative bg-[#f8f8f8]" style={{ aspectRatio: "1" }}>
                    {img ? (
                      <Image src={img} alt={getName(product, isAr)} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-[#ddd]" />
                      </div>
                    )}
                    {/* Wishlist */}
                    <button
                      className="absolute top-2 end-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition hover:scale-110"
                      onClick={e => { e.stopPropagation(); toggleWish(product.id) }}
                      aria-label="Wishlist"
                    >
                      <Heart
                        className="w-4 h-4"
                        style={{ color: wished ? "#ef4444" : "#ccc", fill: wished ? "#ef4444" : "none" }}
                      />
                    </button>
                    {/* Sale badge */}
                    {product.compare_price && product.compare_price > product.price && (
                      <div
                        className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {t("SALE", "تخفيض", isAr)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: accent }}>
                      {product.category}
                    </p>
                    <h3 className={`text-sm font-bold leading-snug line-clamp-2 mb-2 ${isAr ? "text-right" : ""}`}>
                      {getName(product, isAr)}
                    </h3>

                    {/* Stars (decorative) */}
                    <div className={`flex gap-0.5 mb-2 ${isAr ? "flex-row-reverse" : ""}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3" style={{ fill: i < 4 ? accent : "#e5e5e5", color: i < 4 ? accent : "#e5e5e5" }} />
                      ))}
                    </div>

                    {/* Price */}
                    <div className={`flex items-center gap-2 mb-3 ${isAr ? "flex-row-reverse" : ""}`}>
                      <span className="text-base font-black" style={{ color: accent }}>
                        {fmt(product.price)}
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-xs text-[#aaa] line-through">{fmt(product.compare_price)}</span>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={e => { e.stopPropagation(); addToCart(product) }}
                      className="w-full py-2 rounded-xl text-white text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: accent }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {t("Add to Cart", "أضف للسلة", isAr)}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-[#ddd] mx-auto mb-3" />
              <p className="text-[#999] text-sm">
                {searchQ
                  ? t("No products match your search", "لا توجد منتجات تطابق بحثك", isAr)
                  : t("No products in this category", "لا توجد منتجات في هذه الفئة", isAr)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Activation CTA ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ backgroundColor: accent + "0d" }}>
        <div className="max-w-md mx-auto text-center rounded-2xl border bg-white p-8 shadow-sm" style={{ borderColor: accent + "30" }}>
          <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: accent }} />
          <h3 className="text-lg font-black mb-2">
            {t("Activate this store?", "هل تريد تفعيل المتجر؟", isAr)}
          </h3>
          <p className="text-sm text-[#666] mb-5 leading-relaxed">
            {t(
              "Enable real payments, shipping & fulfillment. Commission-only, no monthly fees.",
              "فعّل الدفع الحقيقي والشحن والتخزين. عمولة فقط، بدون اشتراكات شهرية.",
              isAr
            )}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-sm transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            {t("Activate Now", "فعّل الآن", isAr)}
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a1a1a] text-white/50 text-center py-6 px-4 text-xs">
        {storeName} · {t("Powered by", "مدعوم من", isAr)}{" "}
        <Link href="/" className="underline" style={{ color: accent }}>Media Trend</Link>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          CART DRAWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div
            className={`absolute top-0 bottom-0 w-full max-w-sm bg-white flex flex-col shadow-2xl ${isAr ? "left-0" : "right-0"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
              <h2 className="font-black text-base">
                {t("Cart", "سلة التسوق", isAr)}
                {cartCount > 0 && <span className="ms-2 text-sm font-normal text-[#888]">({cartCount})</span>}
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1 text-[#888] hover:text-[#1a1a1a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-[#ddd] mx-auto mb-3" />
                  <p className="text-[#999] text-sm">{t("Your cart is empty", "سلتك فارغة", isAr)}</p>
                </div>
              ) : cart.map(item => {
                const img = getImg(item.product)
                return (
                  <div key={item.product.id} className={`flex gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                    <div className="w-16 h-16 rounded-xl bg-[#f5f5f5] overflow-hidden relative shrink-0">
                      {img ? (
                        <Image src={img} alt={getName(item.product, isAr)} fill className="object-cover" unoptimized />
                      ) : (
                        <ShoppingCart className="w-6 h-6 text-[#ccc] m-auto mt-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold line-clamp-1 ${isAr ? "text-right" : ""}`}>
                        {getName(item.product, isAr)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: accent }}>{fmt(item.product.price)}</p>
                      {/* Qty */}
                      <div className={`flex items-center gap-2 mt-2 ${isAr ? "flex-row-reverse" : ""}`}>
                        <button
                          onClick={() => updateQty(item.product.id, -1)}
                          className="w-6 h-6 rounded-md border border-[#e5e5e5] flex items-center justify-center text-[#555] hover:bg-[#f5f5f5]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, 1)}
                          className="w-6 h-6 rounded-md border border-[#e5e5e5] flex items-center justify-center text-[#555] hover:bg-[#f5f5f5]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => updateQty(item.product.id, -item.quantity)}
                      className="text-[#ccc] hover:text-[#999] self-start mt-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-[#eee] px-5 py-4 space-y-3">
                <div className={`flex items-center justify-between ${isAr ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-[#888]">{t("Subtotal", "المجموع", isAr)}</span>
                  <span className="text-lg font-black" style={{ color: accent }}>{fmt(cartTotal)}</span>
                </div>
                <button
                  className="w-full py-3.5 rounded-xl text-white font-black text-sm transition hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  {t("Checkout", "إتمام الشراء", isAr)}
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-[#e5e5e5] text-[#555] font-medium text-sm"
                >
                  {t("Continue Shopping", "متابعة التسوق", isAr)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PRODUCT DETAIL MODAL (full-page feel on mobile)
      ═══════════════════════════════════════════════════════════════════════ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className={`absolute top-4 z-10 p-2 rounded-full bg-white shadow-md text-[#555] hover:text-[#1a1a1a] ${isAr ? "left-4" : "right-4"}`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product image */}
            <div className="relative bg-[#f8f8f8] rounded-t-3xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {getImg(selectedProduct) ? (
                <Image
                  src={getImg(selectedProduct)!}
                  alt={getName(selectedProduct, isAr)}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-[#ddd]" />
                </div>
              )}
              {/* Slider dots (decorative) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                <div className="w-4 h-1 rounded-full" style={{ backgroundColor: accent }} />
                <div className="w-1 h-1 rounded-full bg-[#ccc]" />
              </div>
            </div>

            {/* Details */}
            <div className="px-5 pt-5 pb-28">
              {/* Category tag */}
              <div className={`flex mb-3 ${isAr ? "justify-end" : ""}`}>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  <Tag className="w-3 h-3" />
                  {selectedProduct.category}
                </span>
              </div>

              {/* Name */}
              <h2 className={`text-2xl font-black leading-tight mb-1 ${isAr ? "text-right" : ""}`}>
                {getName(selectedProduct, isAr)}
              </h2>

              {/* Stars */}
              <div className={`flex items-center gap-1 mb-4 ${isAr ? "flex-row-reverse" : ""}`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ fill: i < 4 ? accent : "#e5e5e5", color: i < 4 ? accent : "#e5e5e5" }} />
                ))}
                <span className="text-xs text-[#999] ms-1">4.0 (24)</span>
              </div>

              {/* Price box */}
              <div className="rounded-xl bg-[#fafaf8] border border-[#eee] px-4 py-3 mb-5">
                <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <span className="text-2xl font-black" style={{ color: accent }}>
                    {fmt(selectedProduct.price)}
                  </span>
                  {selectedProduct.compare_price && selectedProduct.compare_price > selectedProduct.price && (
                    <span className="text-sm text-[#aaa] line-through">{fmt(selectedProduct.compare_price)}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {getDesc(selectedProduct, isAr) && (
                <div className="mb-5">
                  <h4 className={`text-sm font-bold mb-2 ${isAr ? "text-right" : ""}`}>
                    {t("Description", "الوصف", isAr)}
                  </h4>
                  <p className={`text-sm text-[#666] leading-relaxed ${isAr ? "text-right" : ""}`}>
                    {getDesc(selectedProduct, isAr)}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky bottom bar */}
            <div className={`absolute bottom-0 inset-x-0 bg-white border-t border-[#eee] px-5 py-4 flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
              {/* Qty selector */}
              <div className="flex items-center gap-2 shrink-0 border border-[#e5e5e5] rounded-xl px-2 py-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 flex items-center justify-center text-[#555]">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-7 h-7 flex items-center justify-center text-[#555]">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Add to cart */}
              <button
                onClick={() => {
                  addToCart(selectedProduct, qty)
                  setSelected(null)
                  setCartOpen(true)
                }}
                className="flex-1 py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                <ShoppingCart className="w-4 h-4" />
                {t("Add to Cart", "أضف للسلة", isAr)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
