import { NextRequest } from "next/server";
import { validateApiKey, unauthorized, badRequest, serverError, getAdminPhone } from "@/lib/env";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/redis";
import { pushMsg, peekLatest, drainAll, isDerived } from "@/lib/modules/agents/session-store";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";

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

    if (await isDerived(phone)) {
      return Response.json({ success: true, response: "[chat derivado a humano]", phone, derived: true });
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
