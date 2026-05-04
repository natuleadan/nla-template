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
import {
  Configuration,
  WhatsappMessagesApi,
  WhatsappMessageType,
} from "@ycloud-cpaas/ycloud-sdk-node";
import { whatsappSendRateLimit } from "@/lib/external/upstash/ratelimit.service";
import {
  anonymizePhone,
  addToHistory,
} from "@/lib/modules/agents/session-store";
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
    const apiKey = getYcloudApiKey();
    const from = getWhatsappNumber();

    if (!apiKey) {
      return Response.json({ error: t.notConfigured }, { status: 500 });
    }

    if (!from) {
      return Response.json({ error: t.numberNotConfigured }, { status: 500 });
    }

    const raw = await request.json().catch(() => ({}));
    const parsed = WhatsAppSendBodySchema.safeParse(raw);
    if (!parsed.success) return apiError(400, t.missingParams);
    const { to, message, productName } = parsed.data;

    const ip = getClientIp(request);
    const { success } = await whatsappSendRateLimit.limit(`${ip}:${to}`);
    if (!success) {
      return Response.json({ error: t.rateLimitIp }, { status: 429 });
    }

    const configuration = new Configuration({ apiKey });
    const api = new WhatsappMessagesApi(configuration);

    const response = await api.sendDirectly({
      from,
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

    return Response.json({ success: true, data: response.data });
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
