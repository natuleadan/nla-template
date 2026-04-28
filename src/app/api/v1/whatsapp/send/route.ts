import { getYcloudApiKey, getWhatsappNumber, serverError } from "@/lib/env";
import { Configuration, WhatsappMessagesApi, WhatsappMessageType } from "@ycloud-cpaas/ycloud-sdk-node";
import { perMinute, perHour, globalPerHour, getClientIp } from "@/lib/rate-limit";
import { isRedisConfigured, getRedis } from "@/lib/external/upstash/redis";
import { anonymizePhone, addToHistory } from "@/lib/modules/agents/session-store";

export async function POST(request: Request) {
  try {
    const apiKey = getYcloudApiKey();
    const from = getWhatsappNumber();

    if (!apiKey) {
      return Response.json(
        { error: "WhatsApp API no configurada (YCLOUD_API_KEY)" },
        { status: 500 },
      );
    }

    if (!from) {
      return Response.json(
        { error: "WhatsApp número de negocio no configurado (NEXT_PUBLIC_WHATSAPP_NUMBER)" },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { to, message } = body;

    if (!to || !message) {
      return Response.json(
        { error: "Faltan parámetros requeridos: to, message" },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const ipKey = `wa:ratelimit:ip:${ip}`;
    const toKey = `wa:ratelimit:to:${to}`;

    if (isRedisConfigured()) {
      const r = getRedis();
      const [ipOk, toOk] = await Promise.all([
        r.setnx(ipKey, "1").then((ok) => { if (ok) r.expire(ipKey, 30); return ok === 1; }),
        r.setnx(toKey, "1").then((ok) => { if (ok) r.expire(toKey, 30); return ok === 1; }),
      ]);
      if (!ipOk) {
        return Response.json(
          { error: "Demasiadas solicitudes desde esta IP. Espera 30 segundos." },
          { status: 429 },
        );
      }
      if (!toOk) {
        return Response.json(
          { error: "Demasiados mensajes a este número. Espera 30 segundos." },
          { status: 429 },
        );
      }
    } else {
      const globalCheck = globalPerHour.check("global");
      if (!globalCheck.allowed) {
        return Response.json(
          { error: "Demasiados mensajes enviados. Intenta más tarde." },
          { status: 429 },
        );
      }

      const ipPerMinCheck = perMinute.check(ipKey);
      if (!ipPerMinCheck.allowed) {
        return Response.json(
          { error: "Demasiadas solicitudes. Espera un minuto." },
          { status: 429 },
        );
      }

      const ipPerHourCheck = perHour.check(ipKey);
      if (!ipPerHourCheck.allowed) {
        return Response.json(
          { error: "Has alcanzado el límite de mensajes por hora." },
          { status: 429 },
        );
      }

      const toPerHourCheck = perHour.check(toKey);
      if (!toPerHourCheck.allowed) {
        return Response.json(
          { error: "Este número ya ha recibido varios mensajes. Intenta más tarde." },
          { status: 429 },
        );
      }
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
    const productContext = body.productName ? ` [Producto: ${body.productName}]` : "";
    await addToHistory(aid, {
      role: "system",
      content: `[Botón presionado]${productContext} Mensaje enviado al cliente: "${message}"`,
    });

    return Response.json({ success: true, data: response.data });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: { message?: string }; message?: string }; status?: number }; message?: string };
    const ycErr = err.response?.data;
    const msg = typeof ycErr === "object" && ycErr !== null ? (ycErr as { error?: { message?: string }; message?: string }).error?.message || (ycErr as { message?: string }).message || "Error al enviar mensaje" : "Error al enviar mensaje";
    return serverError(msg);
  }
}
