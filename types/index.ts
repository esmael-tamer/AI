/**
 * Shared domain types for Media Trend AI.
 * Source of truth for all entity shapes used across the platform.
 */

// ─── Auth & Users ──────────────────────────────────────────────────────────

export type UserRole = "admin" | "customer"

export type User = {
  id: number
  name_ar: string | null
  name_en: string | null
  email: string
  password_hash: string
  phone: string | null
  role: UserRole
  lang_pref: string
  email_verified: boolean
  email_verification_token: string | null
  email_verification_expires: string | null
  created_at: string
  updated_at: string
}

// ─── Stores ────────────────────────────────────────────────────────────────

export type StoreStatus = "demo" | "pending" | "live" | "suspended"
export type ServiceStatus = "inactive" | "pending" | "active"

export type Store = {
  id: number
  owner_id: number | null
  session_id: string | null
  slug: string
  name_ar: string | null
  name_en: string | null
  store_config: Record<string, unknown>
  status: StoreStatus
  plan: string
  commission_rate_percent: number
  payments_status: ServiceStatus
  shipping_status: ServiceStatus
  warehousing_status: ServiceStatus
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

// ─── Leads & CRM ───────────────────────────────────────────────────────────

export type LeadType = "store_activation" | "ads_launch" | "account_mgmt"
export type LeadStatus = "new" | "contacted" | "qualified" | "closed"

export type Lead = {
  id: number
  user_id: number | null
  store_id: number | null
  name: string | null
  phone: string | null
  email: string | null
  country: string | null
  type: LeadType
  selected_activations: string[]
  payload_json: Record<string, unknown>
  notes: string | null
  status: LeadStatus
  assigned_to: number | null
  created_at: string
}

// ─── Tickets ───────────────────────────────────────────────────────────────

export type TicketType =
  | "payments"
  | "shipping"
  | "warehousing"
  | "ads_launch_request"
  | "account_management_request"

export type TicketStatus = "pending" | "approved" | "in_setup" | "live" | "rejected"

export type Ticket = {
  id: number
  store_id: number | null
  user_id: number | null
  lead_id: number | null
  type: TicketType
  status: TicketStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type SupportTicketPriority = "low" | "medium" | "high"
export type SupportTicketStatus = "open" | "in_progress" | "resolved"

export type SupportTicket = {
  id: number
  user_id: number | null
  store_id: number | null
  subject: string
  message: string
  priority: SupportTicketPriority
  status: SupportTicketStatus
  assigned_to: number | null
  created_at: string
  updated_at: string
}

// ─── Content ───────────────────────────────────────────────────────────────

export type ContentStatus = "draft" | "published"

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
  status: ContentStatus
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
  status: ContentStatus
  published_at: string | null
  created_at: string
}

// ─── Partners & Team ───────────────────────────────────────────────────────

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

// ─── Audit ─────────────────────────────────────────────────────────────────

export type AuditLog = {
  id: number
  admin_id: number | null
  action: string
  entity_type: string | null
  entity_id: number | null
  details_json: Record<string, unknown> | null
  created_at: string
}

// ─── AI Builder ────────────────────────────────────────────────────────────

export type StoreConfig = {
  storeName: string
  storeNameAr: string
  category: string
  description: string
  descriptionAr: string
  themeColor: string
  currency: string
  country: string
  targetAudience: string
  products: ProductSeed[]
}

export type ProductSeed = {
  nameEn: string
  nameAr: string
  descEn: string
  descAr: string
  price: number
  category: string
  image: string
}

export type BuilderStepType = "text" | "select" | "multi-select" | "color"

export type BuilderStep = {
  id: string
  question: string
  questionAr: string
  type: BuilderStepType
  options?: { value: string; label: string; labelAr: string }[]
  field: keyof StoreConfig | "skip"
  placeholder?: string
  placeholderAr?: string
  validation?: (value: string) => boolean
}

// ─── i18n ──────────────────────────────────────────────────────────────────

export type Lang = "ar" | "en"
export type Dir = "rtl" | "ltr"
