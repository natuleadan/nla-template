import { NextRequest } from "next/server";
import { validateApiKey, unauthorized, badRequest, serverError, getAdminPhone } from "@/lib/env";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/redis";
import { pushMsg, peekLatest, drainAll } from "@/lib/modules/agents/session-store";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";
import { createBusOrder } from "@/lib/modules/orders";

const ORDER_PATTERNS = [
  /(?:quiero|necesito|voy a|deseo|requiero)\s+(?:comprar|adquirir|ordenar|pedir|hacer\s*(?:un|el)?\s*pedido)/i,
  /(?:crea|genera|registra|toma|realiza)\s*(?:un|mi|el)?\s*(?:pedido|orden|compra)/i,
  /(?:items?|productos?)\s*=.+total\s*=/i,
  /nuevo\s*pedido/i,
];

function extractOrderData(text: string): Record<string, string> | null {
  const items = text.match(/(?:items?|productos?)\s*[=:]\s*([^,;]+)/i)?.[1]?.trim();
  const total = text.match(/(?:total|monto|precio)\s*[=:]\s*([^,;]+)/i)?.[1]?.trim();
  const email = text.match(/(?:email|correo|e-mail|mail)\s*[=:]\s*([^\s,;]+)/i)?.[1]?.trim();
  const idNumber = text.match(/(?:cedula|ci|id|cédula|ruc|nui|documento)\s*[=:]\s*([^,;]+)/i)?.[1]?.trim();
  const fullName = text.match(/(?:nombre|fullname|name|full_name)\s*[=:]\s*([^,;]+)/i)?.[1]?.trim();
  const deliveryAddress = text.match(/(?:direccion|dirección|address|delivery|envio|envío)\s*[=:]\s*(.+)/i)?.[1]?.trim();
  if (items && total && fullName && deliveryAddress) {
    return { items, total, email: email || "pendiente@mail.com", idNumber: idNumber || "", fullName, deliveryAddress };
  }
  return null;
}

async function processMediaItem(item: { type: string; url?: string; caption?: string }): Promise<string> {
  switch (item.type) {
    case "image":
      if (item.url) {
        const a = await analyzeImage(item.url, item.caption);
        return a ? `[Imagen: ${a}]` : (item.caption ? `[Imagen: ${item.caption}]` : "[Imagen]");
      }
      return item.caption ? `[Imagen: ${item.caption}]` : "[Imagen]";
    case "audio":
    case "voice":
      if (item.url) {
        const t = await transcribeAudio(item.url);
        return t ? `[${item.type === "voice" ? "Nota de voz" : "Audio"} transcrito: ${t}]` : `[${item.type === "voice" ? "Nota de voz" : "Audio"}]`;
      }
      return item.type === "voice" ? "[Nota de voz]" : "[Audio]";
    case "pdf":
      if (item.url) {
        const e = await analyzePdf(item.url, item.caption);
        return e ? `[PDF extraído: ${e}]` : "[Documento: PDF]";
      }
      return "[Documento: PDF]";
    case "video":
      return item.caption ? `[Video: ${item.caption}]` : "[Video]";
    case "document":
      return `[Documento: ${item.caption || "sin nombre"}]`;
    case "sticker":
      return "[Sticker]";
    case "location":
      return `[Ubicación: ${item.caption || ""}]`;
    case "contacts":
      return `[Contacto: ${item.caption || ""}]`;
    case "order":
      return `[Pedido: ${item.caption || "producto"}]`;
    default:
      return `[Mensaje tipo "${item.type}" no soportado]`;
  }
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) return unauthorized();

  try {
    const body = await req.json();
    const { message, phone = "chat_00000000000", media, mediaUrl, mediaCaption, mediaItems } = body;

    const parts: string[] = [];

    if (message && typeof message === "string") {
      parts.push(message);
    }

    if (mediaItems && Array.isArray(mediaItems)) {
      for (const item of mediaItems) {
        parts.push(await processMediaItem(item));
      }
    } else if (media) {
      parts.push(await processMediaItem({ type: media, url: mediaUrl, caption: mediaCaption }));
    }

    if (parts.length === 0) {
      return badRequest("message o media requerido");
    }

    let text = parts.join("\n");

    if (isRedisConfigured()) {
      await pushMsg(phone, text);
      await new Promise((r) => setTimeout(r, 10000));
      const latest = await peekLatest(phone);
      if (latest !== text) {
        return Response.json({ success: true, response: "[en cola, esperando más mensajes...]", phone, queue: true });
      }
      const all = await drainAll(phone);
      text = all.join(", ");
    }

    // Pre-create order if the message contains order data
    const hasOrderIntent = ORDER_PATTERNS.some((p) => p.test(text));
    if (hasOrderIntent) {
      const orderData = extractOrderData(text);
      if (orderData) {
        try {
          const order = await createBusOrder({
            items: orderData.items,
            total: orderData.total,
            email: orderData.email,
            idNumber: orderData.idNumber,
            fullName: orderData.fullName,
            deliveryAddress: orderData.deliveryAddress,
            phone,
          });
          if (order) {
            const msg = `✅ *Pedido #${order.id} creado con éxito*

*Resumen:*
• Productos: ${order.items}
• Total: $${order.total} USD
• Cliente: ${order.fullName}
• Dirección: ${order.deliveryAddress}
• Estado: Pendiente de pago

*Próximos pasos:*
1. Recibirás un enlace de pago
2. Una vez confirmado el pago, procesamos tu envío
3. Puedes compartir tu ubicación para la entrega

¿Necesitas ayuda con el pago o quieres agregar algo más?`;
            return Response.json({ success: true, response: msg, phone, redis: isRedisConfigured(), len: msg.length });
          }
        } catch {
          // Fall through to AI
        }
      }
    }

    const response = await AgentService.processMessage(text, {
      phone,
      customerName: body.customerName,
      isAdmin: phone === getAdminPhone(),
    });

    const result: Record<string, unknown> = {
      success: true, response, phone, redis: isRedisConfigured(), len: response?.length,
    };
    if (media) result.media = media;
    if (typeof response !== "string" || response.length === 0) {
      result.type = typeof response;
    }
    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return serverError(error);
  }
}
