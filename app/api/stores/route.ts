import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import type { StoreConfig } from "@/lib/builder-engine"
import { generateSlug, generateSampleProducts } from "@/lib/builder-engine"

export async function POST(request: Request) {
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

    // Generate cryptographically secure session ID for guest users
    const sessionId = `session_${crypto.randomUUID()}`

    const storeResult = await sql`
      INSERT INTO stores (session_id, slug, name_en, name_ar, store_config, status)
      VALUES (${sessionId}, ${slug}, ${config.storeName}, ${config.storeNameAr || null}, ${JSON.stringify(storeConfig)}, 'draft')
      RETURNING *
    `
    const store = storeResult[0]

    // Generate and insert sample products
    const products = generateSampleProducts(config.category, config.storeName)
    for (const product of products) {
      await sql`
        INSERT INTO products (store_id, name_en, name_ar, desc_en, desc_ar, price, category, images, is_active)
        VALUES (${store.id}, ${product.nameEn}, ${product.nameAr}, ${product.descEn}, ${product.descAr}, ${product.price}, ${product.category}, ${JSON.stringify([product.image])}, true)
      `
    }

    return NextResponse.json({
      success: true,
      store: {
        id: store.id,
        slug: store.slug,
        name: store.name_en,
        sessionId,
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
  }
}
