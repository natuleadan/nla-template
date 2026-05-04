/**
 * Centralized environment configuration.
 * All access to process.env must happen ONLY in this file.
 *
 * - Public vars (NEXT_PUBLIC_*): in env.public.ts — safe for browser
 * - Private vars: here — server-only (API keys, secrets, etc.)
 */

import { timingSafeEqual, pbkdf2Sync } from "node:crypto";
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

export function getBrandColor(): string {
  return (
    process.env.BRAND_COLOR || process.env.NEXT_PUBLIC_BRAND_COLOR || "default"
  );
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

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
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
      console.warn(
        `⚠️ STORE_CURRENCY="${val}" no es un código ISO 4217 válido. Usando USD.`,
      );
  }
  return "USD";
}

export function getZeroDataRetention(): boolean {
  return process.env.AI_GATEWAY_ZDR === "true";
}

// ─── Auth helpers ─────────────────────────────────────────

export function validateApiKey(request: Request): boolean {
  const provided = request.headers.get("x-api-key");
  const expected = getApiKey();
  if (!provided || !expected) return false;
  try {
    const a = pbkdf2Sync(provided, "nla-api-key", 1, 32, "sha512");
    const b = pbkdf2Sync(expected, "nla-api-key", 1, 32, "sha512");
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ─── Response helpers ─────────────────────────────────────

export function unauthorized(): Response {
  return Response.json(
    { error: "No autorizado. Provee header x-api-key." },
    { status: 401 },
  );
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(entity: string): Response {
  return Response.json({ error: `${entity} no encontrado` }, { status: 404 });
}

export function serverError(error: unknown): Response {
  if (isDev) console.error("Server error:", error);
  return Response.json(
    { error: "Error interno del servidor" },
    { status: 500 },
  );
}
