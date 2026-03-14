import postgres from "postgres"

// Re-export all types from the central types directory
export type {
  User,
  Store,
  Product,
  Lead,
  Ticket,
  SupportTicket,
  Page,
  BlogPost,
  Partner,
  TeamMember,
  CaseStudy,
  AuditLog,
} from "@/types"

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: false,
  max: 10,
})

export type QueryResult = Record<string, unknown>[]
