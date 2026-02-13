import { z } from "zod";

// ─── Shared ──────────────────────────────────────────────
const idRequired = z.number().int().positive("ID is required");
const optionalString = z.string().optional();
const optionalUrl = z.string().url().optional().or(z.literal("")).or(z.literal(null)).transform(v => v || undefined);
const sortOrder = z.number().int().min(0).default(0);

// ─── Pages ───────────────────────────────────────────────
export const createPageSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  title_ar: optionalString,
  title_en: optionalString,
  meta_title_ar: optionalString,
  meta_title_en: optionalString,
  meta_desc_ar: optionalString,
  meta_desc_en: optionalString,
  content_json: z.any().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updatePageSchema = z.object({
  id: idRequired,
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes").optional(),
  title_ar: optionalString,
  title_en: optionalString,
  meta_title_ar: optionalString,
  meta_title_en: optionalString,
  meta_desc_ar: optionalString,
  meta_desc_en: optionalString,
  content_json: z.any().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const deletePageSchema = z.object({ id: idRequired });

// ─── Leads ───────────────────────────────────────────────
export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: optionalString,
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  country: optionalString,
  type: z.string().default("store_activation"),
  selected_activations: z.any().optional(),
  payload_json: z.any().optional(),
  notes: optionalString,
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).default("new"),
});

export const updateLeadSchema = z.object({
  id: idRequired,
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(),
  assigned_to: z.number().int().positive().optional().nullable(),
  notes: optionalString,
});

// ─── Team ────────────────────────────────────────────────
export const createTeamMemberSchema = z.object({
  name_ar: optionalString,
  name_en: optionalString,
  role_ar: optionalString,
  role_en: optionalString,
  photo_url: optionalString,
  department: optionalString,
  sort_order: sortOrder,
}).refine(data => data.name_ar || data.name_en, { message: "Name (AR or EN) is required" });

export const updateTeamMemberSchema = z.object({
  id: idRequired,
  name_ar: optionalString,
  name_en: optionalString,
  role_ar: optionalString,
  role_en: optionalString,
  photo_url: optionalString,
  department: optionalString,
  sort_order: z.number().int().min(0).optional(),
});

export const deleteTeamMemberSchema = z.object({ id: idRequired });

// ─── Tickets ─────────────────────────────────────────────
export const createTicketSchema = z.object({
  store_id: z.number().int().positive().optional().nullable(),
  user_id: z.number().int().positive().optional().nullable(),
  lead_id: z.number().int().positive().optional().nullable(),
  type: z.string().min(1, "Type is required"),
  notes: optionalString,
});

export const updateTicketSchema = z.object({
  id: idRequired,
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  notes: optionalString,
});

// ─── Partners ────────────────────────────────────────────
export const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo_url: optionalString,
  website: optionalString,
  sort_order: sortOrder,
});

export const updatePartnerSchema = z.object({
  id: idRequired,
  name: z.string().min(1).max(200).optional(),
  logo_url: optionalString,
  website: optionalString,
  sort_order: z.number().int().min(0).optional(),
});

export const deletePartnerSchema = z.object({ id: idRequired });

// ─── Cases ───────────────────────────────────────────────
export const createCaseSchema = z.object({
  title_ar: optionalString,
  title_en: optionalString,
  desc_ar: optionalString,
  desc_en: optionalString,
  cover_image: optionalString,
  gallery: z.any().optional(),
  client_name: optionalString,
  category: optionalString,
  sort_order: sortOrder,
}).refine(data => data.title_ar || data.title_en, { message: "Title (AR or EN) is required" });

export const updateCaseSchema = z.object({
  id: idRequired,
  title_ar: optionalString,
  title_en: optionalString,
  desc_ar: optionalString,
  desc_en: optionalString,
  cover_image: optionalString,
  gallery: z.any().optional(),
  client_name: optionalString,
  category: optionalString,
  sort_order: z.number().int().min(0).optional(),
});

export const deleteCaseSchema = z.object({ id: idRequired });

// ─── Blog ────────────────────────────────────────────────
export const createBlogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  title_ar: optionalString,
  title_en: optionalString,
  excerpt_ar: optionalString,
  excerpt_en: optionalString,
  content_ar: optionalString,
  content_en: optionalString,
  cover_image: optionalString,
  author_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updateBlogPostSchema = z.object({
  id: idRequired,
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes").optional(),
  title_ar: optionalString,
  title_en: optionalString,
  excerpt_ar: optionalString,
  excerpt_en: optionalString,
  content_ar: optionalString,
  content_en: optionalString,
  cover_image: optionalString,
  author_id: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
});

export const deleteBlogPostSchema = z.object({ id: idRequired });

// ─── Users ───────────────────────────────────────────────
export const updateUserRoleSchema = z.object({
  id: idRequired,
  role: z.enum(["user", "admin", "moderator"], { required_error: "Role is required" }),
});

// ─── Stores ──────────────────────────────────────────────
export const updateStoreSchema = z.object({
  id: idRequired,
  status: z.enum(["pending", "active", "suspended", "closed"]).optional(),
  plan: z.string().optional(),
  commission_rate_percent: z.number().min(0).max(100).optional(),
  payments_status: z.enum(["pending", "active", "disabled"]).optional(),
  shipping_status: z.enum(["pending", "active", "disabled"]).optional(),
  warehousing_status: z.enum(["pending", "active", "disabled"]).optional(),
});

// ─── Helper ──────────────────────────────────────────────
export function formatZodError(error: z.ZodError): string {
  return error.errors.map(e => e.message).join(", ");
}
