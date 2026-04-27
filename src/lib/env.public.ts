/**
 * Public Environment Variables (safe for browser, prefixed with NEXT_PUBLIC_)
 * Next.js inlines these at compile time via DefinePlugin.
 * Must use STATIC property access (process.env.NEXT_PUBLIC_*) so the compiler can replace them.
 */

export function getBrandColor(): string {
  return process.env.NEXT_PUBLIC_BRAND_COLOR || "nla";
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export function getWhatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
}

export function getWeekMax(): number {
  return parseInt(process.env.NEXT_PUBLIC_WEEK_MAX || "4", 10);
}

export function getIndexingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_INDEXING === "true";
}


