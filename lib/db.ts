import postgres from "postgres"

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: false,
  max: 10,
})

export type QueryResult = Record<string, unknown>[]

export type User = {
  id: number
  name_ar: string | null
  name_en: string | null
  email: string
  password_hash: string
  phone: string | null
  role: "admin" | "customer"
  lang_pref: string
  created_at: string
  updated_at: string
}

export type Store = {
  id: number
  owner_id: number | null
  session_id: string | null
  slug: string
  name_ar: string | null
  name_en: string | null
  store_config: Record<string, unknown>
  status: "draft" | "pending" | "live" | "suspended"
  plan: string | null
  commission_rate_percent: number
  payments_status: "inactive" | "pending" | "active"
  shipping_status: "inactive" | "pending" | "active"
  warehousing_status: "inactive" | "pending" | "active"
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  store_id: number
  name_ar: string | null
  name_en: string | null
  desc_ar: string | null
  desc_en: string | null
  price: number
  compare_price: number | null
  images: string[]
  category: string | null
  inventory_count: number
  is_active: boolean
  created_at: string
}

export type Lead = {
  id: number
  user_id: number | null
  store_id: number | null
  name: string | null
  phone: string | null
  email: string | null
  country: string | null
  type: "store_activation" | "ads_launch" | "account_mgmt" | null
  selected_activations: string[]
  payload_json: Record<string, unknown> | null
  notes: string | null
  status: "new" | "contacted" | "qualified" | "closed"
  assigned_to: number | null
  created_at: string
}

export type Ticket = {
  id: number
  store_id: number | null
  user_id: number | null
  lead_id: number | null
  type: "payments" | "shipping" | "warehousing" | "ads_launch_request" | "account_management_request"
  status: "pending" | "approved" | "in_setup" | "live" | "rejected"
  notes: string | null
  created_at: string
  updated_at: string
}

export type SupportTicket = {
  id: number
  user_id: number | null
  store_id: number | null
  subject: string
  message: string
  priority: "low" | "medium" | "high"
  status: "open" | "in_progress" | "resolved"
  assigned_to: number | null
  created_at: string
  updated_at: string
}

export type Page = {
  id: number
  slug: string
  title_ar: string | null
  title_en: string | null
  meta_title_ar: string | null
  meta_title_en: string | null
  meta_desc_ar: string | null
  meta_desc_en: string | null
  content_json: Record<string, unknown>
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: number
  slug: string
  title_ar: string | null
  title_en: string | null
  excerpt_ar: string | null
  excerpt_en: string | null
  content_ar: string | null
  content_en: string | null
  cover_image: string | null
  author_id: number | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
}

export type Partner = {
  id: number
  name: string
  logo_url: string | null
  website: string | null
  sort_order: number
}

export type TeamMember = {
  id: number
  name_ar: string | null
  name_en: string | null
  role_ar: string | null
  role_en: string | null
  photo_url: string | null
  department: string | null
  sort_order: number
}

export type CaseStudy = {
  id: number
  title_ar: string | null
  title_en: string | null
  desc_ar: string | null
  desc_en: string | null
  cover_image: string | null
  gallery: string[]
  client_name: string | null
  category: string | null
  sort_order: number
}

export type AuditLog = {
  id: number
  admin_id: number | null
  action: string
  entity_type: string | null
  entity_id: number | null
  details_json: Record<string, unknown> | null
  created_at: string
}
