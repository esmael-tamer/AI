import { sql } from "@/lib/db"
import type { Store, Product } from "@/lib/db"
import { notFound } from "next/navigation"
import DemoStorefront from "./storefront"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const stores = (await sql`SELECT * FROM stores WHERE slug = ${slug}`) as Store[]
  if (!stores[0]) return { title: "Store Not Found" }
  const store = stores[0]
  const config = (store.store_config || {}) as Record<string, string>
  return {
    title: `${store.name_en || store.name_ar} | Powered by Media Trend`,
    description: config.description || `Shop at ${store.name_en}`,
  }
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params
  const stores = (await sql`SELECT * FROM stores WHERE slug = ${slug}`) as Store[]
  if (!stores[0]) notFound()
  const store = stores[0]

  const products = (await sql`
    SELECT * FROM products WHERE store_id = ${store.id} AND is_active = true ORDER BY created_at DESC
  `) as Product[]

  return <DemoStorefront store={store} products={products} />
}
