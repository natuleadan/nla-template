/**
 * Centralized environment configuration.
 * All access to process.env must happen ONLY in this file.
 *
 * - Public vars (NEXT_PUBLIC_*): in env.public.ts — safe for browser
 * - Private vars: here — server-only (API keys, secrets, etc.)
 */

import { isDev, isTest } from "@/lib/env.public";

export {
  getBaseUrl,
  getWhatsappNumber,
  getWeekMax,
  isDev,
  isProd,
  isTest,
  NODE_ENV,
  VERCEL,
  VERCEL_ENV,
} from "@/lib/env.public";

// ─── Server-only env vars ─────────────────────────────────

const VALID_PALETTES = [
  "default", "amber", "blue", "bronze", "brown", "crimson",
  "cyan", "gold", "grass", "green", "gray", "indigo", "iris", "jade",
  "lime", "mauve", "mint", "olive", "orange", "pink", "plum", "purple",
  "red", "ruby", "sage", "sand", "sky", "slate", "teal", "tomato", "violet", "yellow",
];

export function getBrandColor(): string {
  const val = process.env.BRAND_COLOR || process.env.NEXT_PUBLIC_BRAND_COLOR || "";
  if (val && VALID_PALETTES.includes(val)) return val;
  if (val && !VALID_PALETTES.includes(val)) {
    if (isDev)
      console.warn(`⚠️ BRAND_COLOR="${val}" no es una paleta válida. Usando default.`);
  }
  return "default";
}

export function getIndexingEnabled(): boolean {
  const v = process.env.INDEXING || process.env.NEXT_PUBLIC_INDEXING || "false";
  return v === "true";
}

export function getApiKey(): string {
  const key = process.env.API_KEY;
  if (!key && !isTest) {
    if (isDev)
      console.warn(
        "⚠️ API_KEY no configurada. Los endpoints protegidos devolverán 401.",
      );
  }
  return key || "";
}

export function getYcloudApiKey(): string {
  return process.env.YCLOUD_API_KEY || "";
}

export function getYcloudEnabled(): boolean {
  return process.env.YCLOUD_ENABLED === "true";
}

export function getCookieWebhookUrl(): string {
  return process.env.COOKIE_WEBHOOK_URL || "";
}

export function getAiGatewayApiKey(): string {
  return process.env.AI_GATEWAY_API_KEY || "";
}

export function getYcloudWebhookSecret(): string {
  return process.env.YCLOUD_WEBHOOK_SECRET || "";
}

export function getKvUrl(): string {
  return process.env.KV_REST_API_URL || "";
}

export function getKvToken(): string {
  return process.env.KV_REST_API_TOKEN || "";
}

export function getWsEncryptionKey(): string {
  return process.env.WS_ENCRYPTION_KEY || "";
}

export function getOpenaiApiKey(): string {
  return process.env.OPENAI_API_KEY || "";
}

export function getAdminPhone(): string {
  return process.env.WS_ADMIN || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export type AiProvider = "mixed" | "openai";

export function getAiProvider(): AiProvider {
  const val = process.env.AI_PROVIDER || "mixed";
  if (val === "openai") return "openai";
  return "mixed";
}

export function getRateLimitMax(): number {
  const val = parseInt(process.env.RATE_LIMIT_MAX || "2", 10);
  return Number.isFinite(val) && val > 0 ? val : 2;
}

export function getStoreCurrency(): string {
  const val = process.env.STORE_CURRENCY;
  if (val && /^[A-Z]{3}$/.test(val)) return val;
  if (val && !/^[A-Z]{3}$/.test(val)) {
    if (isDev)
      console.warn(`⚠️ STORE_CURRENCY="${val}" no es un código ISO 4217 válido. Usando USD.`);
  }
  return "USD";
}

export function getCertificateWebhookUrl(): string {
  return process.env.CERTIFICATE_WEBHOOK_URL || "";
}

export function getZeroDataRetention(): boolean {
  return process.env.AI_GATEWAY_ZDR === "true";
}


