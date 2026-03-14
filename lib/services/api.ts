/**
 * Client-side API service layer.
 * Centralizes all fetch calls to the Media Trend API endpoints.
 */

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── Public ────────────────────────────────────────────────────────────────

export const api = {
  // Blog
  getPublishedPosts: () =>
    apiFetch<Record<string, unknown>[]>("/api/admin/blog?status=published"),

  // Work / Case Studies
  getCaseStudies: () =>
    apiFetch<Record<string, unknown>[]>("/api/admin/cases"),

  // Team
  getTeamMembers: () =>
    apiFetch<Record<string, unknown>[]>("/api/admin/team"),

  // Store builder
  createStore: (config: Record<string, unknown>) =>
    apiFetch<{ success: boolean; store: { slug: string; name: string } }>("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }),

  // Leads / Contact
  submitLead: (payload: Record<string, unknown>) =>
    apiFetch<{ success: boolean }>("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  // Geo
  getGeo: () =>
    apiFetch<{ country: string; city: string }>("/api/geo"),
} as const

// ─── Portal (authenticated) ────────────────────────────────────────────────

export const portalApi = {
  getStores: () =>
    apiFetch<Record<string, unknown>[]>("/api/portal/stores"),

  getTickets: () =>
    apiFetch<Record<string, unknown>[]>("/api/portal/tickets"),

  activateStore: (payload: Record<string, unknown>) =>
    apiFetch<{ success: boolean; lead: { id: number }; tickets: { id: number; type: string }[] }>(
      "/api/portal/activate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    ),
} as const

// ─── Admin ─────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () =>
    apiFetch<Record<string, unknown>>("/api/admin/stats"),

  getSection: (section: string) =>
    apiFetch<Record<string, unknown>[]>(`/api/admin/${section}`),

  deleteItem: (section: string, id: number) =>
    apiFetch<{ success: boolean }>(`/api/admin/${section}?id=${id}`, {
      method: "DELETE",
    }),
} as const
