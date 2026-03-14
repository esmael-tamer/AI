"use client"

import type { Store, Product } from "@/types"
import { useState, useMemo } from "react"
import {
  ShoppingBag,
  Search,
  Heart,
  Star,
  Plus,
  Minus,
  X,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type CartItem = {
  product: Product
  quantity: number
}

const MENA_COUNTRIES = ["SA", "AE", "EG", "KW", "BH", "QA", "OM", "JO"]

function t(en: string, ar: string, isAr: boolean) {
  return isAr ? ar : en
}

export default function DemoStorefront({ store, products }: { store: Store; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const config = (store.store_config || {}) as Record<string, string>
  const themeColor = config.themeColor || "#a3e635"
  const currency = config.currency || "USD"
  const country = config.country || ""

  // Bilingual: default to Arabic for MENA countries
  const defaultAr = MENA_COUNTRIES.includes(country)
  const [isAr, setIsAr] = useState(defaultAr)
  const dir = isAr ? "rtl" : "ltr"

  const storeName = isAr ? (store.name_ar || store.name_en || "متجر") : (store.name_en || store.name_ar || "Store")
  const storeDesc = isAr ? (config.descriptionAr || config.description || "") : (config.description || "")

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products])

  const filteredProducts = useMemo(() => {
    let list = products
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name_en?.toLowerCase().includes(q) ||
          p.name_ar?.includes(searchQuery) ||
          p.category?.toLowerCase().includes(q)
      )
    }
    return list
  }, [products, selectedCategory, searchQuery])

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId))
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat(isAr ? "ar" : "en", { style: "currency", currency }).format(amount)
  }

  function getProductName(product: Product) {
    return isAr ? (product.name_ar || product.name_en || "") : (product.name_en || product.name_ar || "")
  }

  function getProductDesc(product: Product) {
    return isAr ? (product.desc_ar || product.desc_en || "") : (product.desc_en || product.desc_ar || "")
  }

  function getProductImage(product: Product): string | null {
    const images = product.images
    if (Array.isArray(images) && images.length > 0) return images[0]
    return null
  }

  return (
    <div className="min-h-screen" dir={dir} style={{ ["--store-accent" as string]: themeColor }}>
      {/* Powered by banner */}
      <div className="bg-black/80 text-center py-1.5 px-4 border-b border-white/10">
        <p className="text-xs text-muted-foreground">
          {t("Demo store powered by", "متجر تجريبي مدعوم من", isAr)}{" "}
          <Link href="/" className="text-[#a3e635] hover:underline">
            Media Trend
          </Link>
          {" | "}
          <Link href="/builder" className="text-[#a3e635] hover:underline">
            {t("Build Your Own", "أنشئ متجرك", isAr)}
          </Link>
        </p>
      </div>

      {/* Store Header */}
      <header className="sticky top-0 z-40 liquid-glass-header">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-black"
              style={{ backgroundColor: themeColor }}
            >
              {storeName[0]}
            </div>
            <span className="font-semibold text-foreground text-lg">{storeName}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-sm transition-colors whitespace-nowrap px-3 py-1 rounded-full ${selectedCategory === "all" ? "text-black font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              style={selectedCategory === "all" ? { backgroundColor: themeColor } : {}}
            >
              {t("All", "الكل", isAr)}
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm transition-colors whitespace-nowrap px-3 py-1 rounded-full capitalize ${selectedCategory === cat ? "text-black font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                style={selectedCategory === cat ? { backgroundColor: themeColor } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setIsAr(!isAr)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? "EN" : "ع"}</span>
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("Search", "بحث", isAr)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("Cart", "السلة", isAr)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                  style={{ backgroundColor: themeColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-white/10 px-4 py-2">
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search products...", "ابحث عن منتجات...", isAr)}
                className="w-full bg-white/5 border border-white/10 rounded-lg ps-9 pe-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner */}
      <section className="py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">{storeName}</h1>
          {storeDesc && <p className="mt-3 text-muted-foreground text-lg text-pretty">{storeDesc}</p>}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" style={{ color: themeColor }} />
              {t("Free Shipping", "شحن مجاني", isAr)}
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" style={{ color: themeColor }} />
              {t("Secure Payment", "دفع آمن", isAr)}
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" style={{ color: themeColor }} />
              {t("Easy Returns", "إرجاع سهل", isAr)}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Category Filter */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full transition-colors shrink-0 ${selectedCategory === "all" ? "text-black font-semibold" : "text-muted-foreground bg-white/5"}`}
            style={selectedCategory === "all" ? { backgroundColor: themeColor } : {}}
          >
            {t("All", "الكل", isAr)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full transition-colors capitalize shrink-0 ${selectedCategory === cat ? "text-black font-semibold" : "text-muted-foreground bg-white/5"}`}
              style={selectedCategory === cat ? { backgroundColor: themeColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {t("Products", "المنتجات", isAr)}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} {t("items", "منتج", isAr)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const imgSrc = getProductImage(product)
              return (
                <div
                  key={product.id}
                  className="group glass-border-subtle rounded-2xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={getProductName(product)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-white/10" />
                      </div>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                      <div
                        className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-black"
                        style={{ backgroundColor: themeColor }}
                      >
                        {t("SALE", "تخفيض", isAr)}
                      </div>
                    )}
                    <button
                      className="absolute top-2 end-2 p-1.5 rounded-full glass-border-subtle opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={t("Add to wishlist", "أضف للمفضلة", isAr)}
                    >
                      <Heart className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground capitalize mb-0.5">{product.category}</p>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1">{getProductName(product)}</h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-current"
                          style={{ color: i < 4 ? themeColor : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ms-1">(24)</span>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-foreground text-sm">{formatPrice(product.price)}</span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        className="p-1.5 rounded-xl text-black transition-colors hover:opacity-90 shrink-0"
                        style={{ backgroundColor: themeColor }}
                        aria-label={t("Add to cart", "أضف للسلة", isAr)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? t("No products match your search.", "لا توجد منتجات تطابق بحثك.", isAr)
                  : t("No products in this category.", "لا توجد منتجات في هذا القسم.", isAr)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Activation CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center glass-border rounded-2xl p-8">
          <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: themeColor }} />
          <h3 className="text-xl font-bold text-foreground">
            {t("Want to activate this store?", "هل تريد تفعيل هذا المتجر؟", isAr)}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Enable real payments, shipping, and go live with your store.",
              "فعّل المدفوعات الحقيقية والشحن وأطلق متجرك.",
              isAr
            )}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            {t("Activate Now", "فعّل الآن", isAr)}
            <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </section>

      {/* Store Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            {storeName} | {t("Powered by", "مدعوم من", isAr)}{" "}
            <Link href="/" className="hover:underline" style={{ color: themeColor }}>
              Media Trend
            </Link>
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div
            className={`absolute top-0 bottom-0 w-full max-w-md liquid-glass-enhanced border-white/10 flex flex-col ${isAr ? "left-0 border-e" : "right-0 border-s"}`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-foreground">
                {t("Cart", "السلة", isAr)} ({cartCount})
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground" aria-label={t("Close", "إغلاق", isAr)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("Your cart is empty", "سلتك فارغة", isAr)}</p>
                </div>
              ) : (
                cart.map((item) => {
                  const imgSrc = getProductImage(item.product)
                  return (
                    <div key={item.product.id} className="flex gap-4 glass-border-subtle rounded-xl p-3">
                      <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0 relative">
                        {imgSrc ? (
                          <Image src={imgSrc} alt={getProductName(item.product)} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-white/10" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{getProductName(item.product)}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.product.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-foreground hover:bg-white/10"
                            aria-label={t("Decrease", "تقليل", isAr)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-foreground w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-foreground hover:bg-white/10"
                            aria-label={t("Increase", "زيادة", isAr)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-foreground self-start"
                        aria-label={t("Remove", "حذف", isAr)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("Subtotal", "المجموع", isAr)}</span>
                  <span className="text-lg font-bold text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-black transition-colors hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  {t("Checkout", "إتمام الشراء", isAr)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative liquid-glass-enhanced rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className={`absolute top-4 z-10 p-1.5 rounded-full bg-black/40 text-muted-foreground hover:text-foreground ${isAr ? "left-4" : "right-4"}`}
              aria-label={t("Close", "إغلاق", isAr)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-white/5 rounded-t-2xl overflow-hidden relative">
              {getProductImage(selectedProduct) ? (
                <Image
                  src={getProductImage(selectedProduct)!}
                  alt={getProductName(selectedProduct)}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-white/10" />
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs text-muted-foreground capitalize">{selectedProduct.category}</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{getProductName(selectedProduct)}</h3>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: i < 4 ? themeColor : "rgba(255,255,255,0.1)" }} />
                ))}
                <span className="text-sm text-muted-foreground ms-1">4.0 (24 {t("reviews", "تقييم", isAr)})</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.compare_price && selectedProduct.compare_price > selectedProduct.price && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(selectedProduct.compare_price)}</span>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{getProductDesc(selectedProduct)}</p>
              <button
                onClick={() => {
                  addToCart(selectedProduct)
                  setSelectedProduct(null)
                  setCartOpen(true)
                }}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-black transition-colors hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
              >
                <ShoppingBag className="w-4 h-4" />
                {t("Add to Cart", "أضف للسلة", isAr)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
