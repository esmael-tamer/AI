import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateSlug, generateSampleProducts } from "@/lib/builder-engine"
import { checkAdminAuth } from "@/lib/admin-auth"

const DEMO_STORES = [
  {
    slug: "demo-khayal-perfumes",
    name_en: "Khayal Perfumes",
    name_ar: "خيال للعطور",
    category: "perfumes",
    themeColor: "#c9a84c",
    currency: "SAR",
    country: "SA",
  },
  {
    slug: "demo-elegance-fashion",
    name_en: "Elegance Fashion",
    name_ar: "أناقة للأزياء",
    category: "fashion",
    themeColor: "#ec4899",
    currency: "AED",
    country: "AE",
  },
  {
    slug: "demo-glow-skincare",
    name_en: "Glow Collective",
    name_ar: "غلو للجمال",
    category: "skincare",
    themeColor: "#8b5cf6",
    currency: "SAR",
    country: "SA",
  },
]

export async function GET() {
  const authError = await checkAdminAuth()
  if (authError) return authError
  try {
    const results: { slug: string; created: boolean }[] = []

    for (const demo of DEMO_STORES) {
      // Check if already exists
      const existing = await sql`SELECT id FROM stores WHERE slug = ${demo.slug}`
      if (existing.length > 0) {
        results.push({ slug: demo.slug, created: false })
        continue
      }

      const storeConfig = {
        themeColor: demo.themeColor,
        currency: demo.currency,
        country: demo.country,
        targetAudience: "general",
        description: demo.name_en,
        descriptionAr: demo.name_ar,
      }

      const sessionId = `demo_${demo.slug}`

      const storeResult = await sql`
        INSERT INTO stores (session_id, slug, name_en, name_ar, store_config, status)
        VALUES (${sessionId}, ${demo.slug}, ${demo.name_en}, ${demo.name_ar}, ${JSON.stringify(storeConfig)}, 'demo')
        RETURNING *
      `
      const store = storeResult[0]

      // Insert sample products
      const products = generateSampleProducts(demo.category, demo.name_en)
      for (const product of products) {
        await sql`
          INSERT INTO products (store_id, name_en, name_ar, desc_en, desc_ar, price, category, images, is_active)
          VALUES (${store.id}, ${product.nameEn}, ${product.nameAr}, ${product.descEn}, ${product.descAr}, ${product.price}, ${product.category}, ${JSON.stringify([product.image])}, true)
        `
      }

      results.push({ slug: demo.slug, created: true })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Seed demos error:", error)
    return NextResponse.json({ error: "Failed to seed demo stores" }, { status: 500 })
  }
}
