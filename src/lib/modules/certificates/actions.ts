"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { getCertificateWebhookUrl, isDev, getRateLimitMax } from "@/lib/env";
import { CertificatesResponseSchema } from "./schemas";
import { RateLimiter } from "@/lib/rate-limit";
import { isRedisConfigured } from "@/lib/external/upstash/client";
import { certRateLimit } from "@/lib/external/upstash/ratelimit.service";

const inMemoryRl = new RateLimiter({
  maxRequests: getRateLimitMax(),
  windowMs: 60_000,
});

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function verifyCertificates(
  id: string,
): Promise<{ success: boolean; data?: unknown; code?: string; error?: string }> {
  const cleaned = id.replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned || cleaned.length < 10) {
    return { success: false, code: "invalidId" };
  }

  const ip = await getClientIp();
  const rlKey = hashIp(ip);

  const isRedis = isRedisConfigured();
  if (isRedis) {
    const { success } = await certRateLimit.limit(rlKey);
    if (!success) {
      return { success: false, code: "rateLimit" };
    }
  } else {
    const { allowed } = inMemoryRl.check(rlKey);
    if (!allowed) {
      return { success: false, code: "rateLimit" };
    }
  }

  const url = getCertificateWebhookUrl();
  if (!url) {
    return { success: false, code: "serviceUnavailable" };
  }

  try {
    const res = await fetch(`${url}?id=${encodeURIComponent(cleaned)}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      if (isDev) console.error("[CERT] HTTP", res.status);
      return { success: false, code: "fetchError" };
    }

    const json = await res.json();

    if (!json || json.error) {
      return { success: false, code: "notFound" };
    }

    const parsed = CertificatesResponseSchema.safeParse(json);
    if (!parsed.success) {
      if (isDev) console.error("[CERT] Invalid response:", parsed.error);
      return { success: false, code: "invalidResponse" };
    }

    return { success: true, data: parsed.data };
  } catch (err) {
    if (isDev) console.error("[CERT] Network error:", err);
    return { success: false, code: "networkError" };
  }
}
