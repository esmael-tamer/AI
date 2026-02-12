"use client"

import type { Store, Product } from "@/lib/db"
import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

type CartItem = {
  product: Product
  quantity: number
}

export default function DemoStorefront({ store, products }: { store: Store; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const config = (store.store_config || {}) as Record<string, string>
  const themeColor = config.themeColor || "#a3e635"
  const currency = config.currency || "USD"
  const storeName = store.name_en || store.name_ar || "Store"
  const storeDesc = config.description || `Welcome to ${storeName}`

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

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
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount)
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen" style={{ ["--store-accent" as string]: themeColor }}>
      {/* Powered by banner */}
      <div className="bg-black/80 text-center py-1.5 px-4 border-b border-white/10">
        <p className="text-xs text-muted-foreground">
          This is a demo store powered by{" "}
          <Link href="/" className="text-[#a3e635] hover:underline">
            Media Trend
          </Link>
          {" "} | {" "}
          <Link href="/builder" className="text-[#a3e635] hover:underline">
            Build Your Own
          </Link>
        </p>
      </div>

      {/* Store Header */}
      <header className="sticky top-0 z-40 liquid-glass-header">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-black"
              style={{ backgroundColor: themeColor }}
            >
              {storeName[0]}
            </div>
            <span className="font-semibold text-foreground text-lg">{storeName}</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</button>
            {categories.slice(0, 4).map((cat) => (
              <button key={cat} className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize">
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cart"
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
      </header>

      {/* Hero Banner */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">{storeName}</h1>
          <p className="mt-3 text-muted-foreground text-lg text-pretty">{storeDesc}</p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" style={{ color: themeColor }} />
              Free Shipping
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" style={{ color: themeColor }} />
              Secure Payment
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" style={{ color: themeColor }} />
              Easy Returns
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Products</h2>
            <span className="text-sm text-muted-foreground">{products.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group glass-border-subtle rounded-2xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-white/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-white/10" />
                  </div>
                  {product.compare_price && product.compare_price > product.price && (
                    <div
                      className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-black"
                      style={{ backgroundColor: themeColor }}
                    >
                      SALE
                    </div>
                  )}
                  <button
                    className="absolute top-3 right-3 p-2 rounded-full glass-border-subtle opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">{product.name_en}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" style={{ color: i < 4 ? themeColor : "rgba(255,255,255,0.1)" }} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(24)</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      className="p-2 rounded-xl text-black transition-colors hover:opacity-90"
                      style={{ backgroundColor: themeColor }}
                      aria-label="Add to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center glass-border-subtle rounded-2xl p-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products yet. Products will be added soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Activation CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center glass-border rounded-2xl p-8">
          <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: themeColor }} />
          <h3 className="text-xl font-bold text-foreground">Want to activate this store?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enable real payments, shipping, and go live with your store.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            Activate Now
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Store Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            {storeName} | Powered by{" "}
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
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md liquid-glass-enhanced border-l border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-foreground">Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 glass-border-subtle rounded-xl p-3">
                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-white/10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.product.name_en}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-foreground hover:bg-white/10"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm text-foreground w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-foreground hover:bg-white/10"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-foreground self-start"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-black transition-colors hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  Checkout
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
          <div className="relative liquid-glass-enhanced rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-white/5 rounded-t-2xl flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white/10" />
            </div>
            <div className="p-6">
              <p className="text-xs text-muted-foreground capitalize">{selectedProduct.category}</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{selectedProduct.name_en}</h3>
              {selectedProduct.name_ar && (
                <p className="text-sm text-muted-foreground mt-0.5 text-right" dir="rtl">{selectedProduct.name_ar}</p>
              )}
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: i < 4 ? themeColor : "rgba(255,255,255,0.1)" }} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.0 (24 reviews)</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.compare_price && selectedProduct.compare_price > selectedProduct.price && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(selectedProduct.compare_price)}</span>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{selectedProduct.desc_en}</p>
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
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
