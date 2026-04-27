/**
 * Centralized environment configuration.
 * All access to process.env must happen ONLY in this file.
 *
 * - Public vars (NEXT_PUBLIC_*): in env.public.ts — safe for browser
 * - Private vars: here — server-only (API keys, secrets, etc.)
 */

export {
  getBrandColor,
  getBaseUrl,
  getWhatsappNumber,
  getWeekMax,
  getIndexingEnabled,
} from "@/lib/env.public";

// ─── Server-only env vars ─────────────────────────────────

export function getApiKey(): string {
  return process.env.API_KEY || "dev-key-change-in-production";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
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
  console.error("Server error:", error);
  return Response.json(
    { error: "Error interno del servidor" },
    { status: 500 },
  );
}
