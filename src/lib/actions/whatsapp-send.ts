"use server";

import { createHash } from "node:crypto";
import {
  getYcloudApiKey,
  getYcloudEnabled,
  getWhatsappNumber,
  getRateLimitMax,
  isDev,
} from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import {
  Configuration,
  WhatsappMessagesApi,
  WhatsappMessageType,
} from "@ycloud-cpaas/ycloud-sdk-node";
import { headers } from "next/headers";
import { whatsappSendRateLimit } from "@/lib/external/upstash/ratelimit.service";
import { isRedisConfigured } from "@/lib/external/upstash/client";
import { RateLimiter } from "@/lib/rate-limit";
import {
  anonymizePhone,
  addToHistory,
} from "@/lib/modules/agents/session-store";
import { WhatsAppSendBodySchema } from "@/lib/api/schemas";

const inMemoryRl = new RateLimiter({
  maxRequests: getRateLimitMax(),
  windowMs: 60_000,
});

export type WhatsAppSendResult =
  | { success: true }
  | { success: false; error: string; rateLimit?: boolean };

export async function whatsappSendAction(data: {
  to: string;
  message: string;
  productId?: string;
  productName?: string;
}): Promise<WhatsAppSendResult> {
  const parsed = WhatsAppSendBodySchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Parámetros inválidos" };

  const { to, message, productId, productName } = parsed.data;

  if (!getYcloudEnabled())
    return { success: false, error: "YCloud deshabilitado" };
  if (!getYcloudApiKey())
    return { success: false, error: "API Key no configurada" };
  if (!getWhatsappNumber())
    return { success: false, error: "Número no configurado" };

  const h = await headers();
  const raw =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1";
  const ipHash = createHash("sha256").update(raw).digest("hex").slice(0, 16);
  const rlKey = `${ipHash}:${to}`;

  try {
    const result = await Promise.race([
      executeSend({ to, message, productId, productName, rlKey }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout 15s")), 15000),
      ),
    ]);
    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al enviar";
    if (isDev) console.error("[WHATSAPP] Error:", msg);
    return { success: false, error: msg };
  }
}

async function executeSend(params: {
  to: string;
  message: string;
  productId?: string;
  productName?: string;
  rlKey: string;
}): Promise<WhatsAppSendResult> {
  const { to, message, productId, productName, rlKey } = params;
  const isRedis = isRedisConfigured();

  if (isDev)
    console.log("[WHATSAPP] Rate limit key:", rlKey, "Redis:", isRedis);

  if (isRedis) {
    const { success } = await whatsappSendRateLimit.limit(rlKey);
    if (isDev) console.log("[WHATSAPP] Redis limit result:", success);
    if (!success)
      return {
        success: false,
        error: getConfig("es").ui.whatsapp.send.rateLimitIp,
        rateLimit: true,
      };
  } else {
    const { allowed } = inMemoryRl.check(rlKey);
    if (isDev) console.log("[WHATSAPP] In-memory limit result:", allowed);
    if (!allowed)
      return {
        success: false,
        error: getConfig("es").ui.whatsapp.send.rateLimitIp,
        rateLimit: true,
      };
  }

  const response = await new WhatsappMessagesApi(
    new Configuration({ apiKey: getYcloudApiKey() }),
  ).sendDirectly({
    from: getWhatsappNumber(),
    to,
    type: WhatsappMessageType.Text,
    text: { body: message },
  });

  const aid = await anonymizePhone(to.replace("+", ""));
  const productContext = productName ? ` [Producto: ${productName}]` : "";
  await addToHistory(aid, {
    role: "system",
    content: `[Botón presionado]${productContext} Mensaje enviado al cliente: "${message}"`,
  });

  if (isDev) console.log("[WHATSAPP] Sent OK, history:", aid);
  return { success: true };
}
