import { NextRequest } from "next/server";
import { validateApiKey, unauthorized, badRequest, serverError } from "@/lib/env";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/redis";
import { pushMsg, peekLatest, drainAll } from "@/lib/modules/agents/session-store";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) return unauthorized();

  try {
    const body = await req.json();
    const { message, phone = "chat_00000000000", media, mediaUrl, mediaCaption, mimeType } = body;

    let text = "";

    if (message && typeof message === "string") {
      text = message;
    } else if (media) {
      switch (media) {
        case "image":
          if (mediaUrl) {
            const analyzed = await analyzeImage(mediaUrl, mediaCaption);
            text = analyzed ? `[Imagen: ${analyzed}]` : (mediaCaption ? `[Imagen: ${mediaCaption}]` : "[Imagen]");
          } else {
            text = mediaCaption ? `[Imagen: ${mediaCaption}]` : "[Imagen]";
          }
          break;
        case "audio":
          if (mediaUrl) {
            const transcribed = await transcribeAudio(mediaUrl);
            text = transcribed ? `[Audio transcrito: ${transcribed}]` : "[Audio]";
          } else {
            text = "[Audio]";
          }
          break;
        case "voice":
          if (mediaUrl) {
            const transcribed = await transcribeAudio(mediaUrl);
            text = transcribed ? `[Nota de voz transcrita: ${transcribed}]` : "[Nota de voz]";
          } else {
            text = "[Nota de voz]";
          }
          break;
        case "pdf":
          if (mediaUrl) {
            const extracted = await analyzePdf(mediaUrl, mediaCaption);
            text = extracted ? `[PDF extraído: ${extracted}]` : `[Documento: PDF]`;
          } else {
            text = "[Documento: PDF]";
          }
          break;
        case "video":
          text = mediaCaption ? `[Video: ${mediaCaption}]` : "[Video]";
          break;
        case "document":
          text = `[Documento: ${mediaCaption || "sin nombre"}]`;
          break;
        case "sticker":
          text = "[Sticker]";
          break;
        case "location":
          text = `[Ubicación: ${mediaCaption || ""}]`;
          break;
        case "contacts":
          text = `[Contacto: ${mediaCaption || ""}]`;
          break;
        case "order":
          text = `[Pedido: ${mediaCaption || "producto"}]`;
          break;
        default:
          text = `[Mensaje tipo "${media}" no soportado]`;
      }
    }

    if (!text) {
      return badRequest("message o media requerido");
    }

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
      customerName: body.customerName || "Chat User",
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
