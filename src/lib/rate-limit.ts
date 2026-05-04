interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  constructor(private config: RateLimitConfig) {}

  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.config.windowMs });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt: now + this.config.windowMs,
      };
    }

    entry.count++;

    if (entry.count > this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  reset(key: string) {
    this.store.delete(key);
  }
}

export const perMinute = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
export const perHour = new RateLimiter({
  maxRequests: 10,
  windowMs: 3_600_000,
});
export const globalPerHour = new RateLimiter({
  maxRequests: 50,
  windowMs: 3_600_000,
});

export const catalogRateLimit = new RateLimiter({
  maxRequests: 120,
  windowMs: 60_000,
});
export const categoryRateLimit = new RateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
});
export const reviewRateLimit = new RateLimiter({
  maxRequests: 30,
  windowMs: 60_000,
});
export const agendaRateLimit = new RateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
});

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}
