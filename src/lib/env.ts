/**
 * Centralized environment configuration.
 * All access to process.env must happen ONLY in this file.
 *
 * - Public vars (NEXT_PUBLIC_*): in env.public.ts — safe for browser
 * - Private vars: here — server-only (API keys, secrets, etc.)
 */

import { isDev } from "@/lib/env.public";

export {
  getBrandColor,
  getBaseUrl,
  getWhatsappNumber,
  getWeekMax,
  getIndexingEnabled,
  isDev,
  isProd,
  isTest,
  NODE_ENV,
  VERCEL,
  VERCEL_ENV,
} from "@/lib/env.public";

// ─── Server-only env vars ─────────────────────────────────

export function getApiKey(): string {
  return process.env.API_KEY || "dev-key-change-in-production";
}

export function getYcloudApiKey(): string {
  return process.env.YCLOUD_API_KEY || "";
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

export type AiProvider = "mixed" | "openai";

export function getAiProvider(): AiProvider {
  const val = process.env.AI_PROVIDER || "mixed";
  if (val === "openai") return "openai";
  return "mixed";
}

export function getZeroDataRetention(): boolean {
  return process.env.AI_GATEWAY_ZDR === "true";
}

// ─── Auth helpers ─────────────────────────────────────────

export function validateApiKey(request: Request): boolean {
  const authHeader = request.headers.get("x-api-key");
  return authHeader === getApiKey();
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
