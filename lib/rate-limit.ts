interface RateLimitOptions {
  interval: number  // Time window in ms
  maxRequests: number  // Max requests per window
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

export function rateLimit({ interval, maxRequests }: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>()

  // Clean up expired entries every 5 minutes
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetTime) {
        store.delete(key)
      }
    }
  }, 5 * 60 * 1000)

  return {
    check(key: string): boolean {
      const now = Date.now()
      const entry = store.get(key)

      if (!entry || now > entry.resetTime) {
        store.set(key, { count: 1, resetTime: now + interval })
        return true
      }

      if (entry.count >= maxRequests) {
        return false
      }

      entry.count++
      return true
    },
  }
}

export const adminLimiter = rateLimit({ interval: 15 * 60 * 1000, maxRequests: 200 })
