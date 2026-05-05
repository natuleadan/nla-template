import { createHash } from "node:crypto";
import {
  getYcloudApiKey,
  getYcloudEnabled,
  getWhatsappNumber,
  serverError,
  validateApiKey,
  unauthorized,
} from "@/lib/env";
import { getClientIp } from "@/lib/rate-limit";
import { getConfig } from "@/lib/locale/config";
import { sendWithHistory } from "@/lib/external/whatsapp/send";
import { whatsappSendRateLimit } from "@/lib/external/upstash/ratelimit.service";
import { WhatsAppSendBodySchema, apiError } from "@/lib/api/schemas";

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || "es";
  const t = getConfig(locale).ui.whatsapp.send;

  if (!getYcloudEnabled()) {
    return Response.json({ error: t.ycloudDisabled }, { status: 501 });
  }

  try {
    if (!getYcloudApiKey()) {
      return Response.json({ error: t.notConfigured }, { status: 500 });
    }

    if (!getWhatsappNumber()) {
      return Response.json({ error: t.numberNotConfigured }, { status: 500 });
    }

    const raw = await request.json().catch(() => ({}));
    const parsed = WhatsAppSendBodySchema.safeParse(raw);
    if (!parsed.success) return apiError(400, t.missingParams);
    const { to, message, productName } = parsed.data;

    const ip = getClientIp(request);
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const phoneHash = createHash("sha256").update(to).digest("hex").slice(0, 16);
    const { success } = await whatsappSendRateLimit.limit(`${ipHash}:${phoneHash}`);
    if (!success) {
      return Response.json({ error: t.rateLimitIp }, { status: 429 });
    }

    const result = await sendWithHistory(to, message, productName);
    if (!result.success) return serverError(t.sendError);

    return Response.json({ success: true, data: result.data });
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { error?: { message?: string }; message?: string };
        status?: number;
      };
      message?: string;
    };
    const ycErr = err.response?.data;
    const msg =
      typeof ycErr === "object" && ycErr !== null
        ? (ycErr as { error?: { message?: string }; message?: string }).error
            ?.message ||
          (ycErr as { message?: string }).message ||
          t.sendError
        : t.sendError;
    return serverError(msg);
  }
}
