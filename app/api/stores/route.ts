import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import type { StoreConfig } from "@/types"
import { generateSlug, generateSampleProducts } from "@/lib/builder-engine"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(`stores:${ip}`, 5, 60 * 60 * 1000) // 5 stores per hour per IP
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many store creation requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  try {
    const config: StoreConfig = await request.json()

    if (!config.storeName) {
      return NextResponse.json({ error: "Store name is required" }, { status: 400 })
    }

    // Generate unique slug
    let slug = generateSlug(config.storeName)
    const existing = await sql`SELECT id FROM stores WHERE slug = ${slug}`
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Determine currency based on country
    const currencyMap: Record<string, string> = {
      SA: "SAR", AE: "AED", EG: "EGP", KW: "KWD",
      BH: "BHD", QA: "QAR", OM: "OMR", JO: "JOD",
    }
    const currency = currencyMap[config.country] || "USD"

    // Create the store
    const storeConfig = {
      themeColor: config.themeColor || "#a3e635",
      currency,
      country: config.country,
      targetAudience: config.targetAudience,
      description: config.description,
      descriptionAr: config.descriptionAr || "",
    }

    // Generate session ID for guest users
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const storeResult = await sql`
      INSERT INTO stores (session_id, slug, name_en, name_ar, store_config, status)
      VALUES (${sessionId}, ${slug}, ${config.storeName}, ${config.storeNameAr || null}, ${JSON.stringify(storeConfig)}, 'demo')
      RETURNING *
    `
    const store = storeResult[0]

    // Generate and insert sample products (parallel, not sequential)
    const products = generateSampleProducts(config.category, config.storeName)
    await Promise.all(products.map(product => sql`
      INSERT INTO products (store_id, name_en, name_ar, desc_en, desc_ar, price, category, images, is_active)
      VALUES (${store.id}, ${product.nameEn}, ${product.nameAr}, ${product.descEn}, ${product.descAr}, ${product.price}, ${product.category}, ${JSON.stringify([product.image])}, true)
    `))

    return NextResponse.json({
      success: true,
      store: {
        id: store.id,
        slug: store.slug,
        name: store.name_en,
        sessionId,
      },
    })
  } catch (error) {
    logger.error("api", "Failed to create store:", error)
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
  }
}
