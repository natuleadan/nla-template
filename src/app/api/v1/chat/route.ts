import { NextRequest } from "next/server";
import { validateApiKey, unauthorized, badRequest, serverError, getAdminPhone } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/redis";
import { pushMsg, peekLatest, drainAll, isDerived } from "@/lib/modules/agents/session-store";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";

const t = getConfig("es").ui.media;

async function processMediaItem(item: { type: string; url?: string; caption?: string }): Promise<string> {
  switch (item.type) {
    case "image":
      if (item.url) {
        const a = await analyzeImage(item.url, item.caption);
        return a ? t.image(a) : (item.caption ? t.image(item.caption) : t.imageSimple);
      }
      return item.caption ? t.image(item.caption) : t.imageSimple;
    case "audio":
    case "voice":
      if (item.url) {
        const transcript = await transcribeAudio(item.url);
        return item.type === "voice"
          ? (transcript ? t.voice(transcript) : t.voiceSimple)
          : (transcript ? t.audio(transcript) : t.audioSimple);
      }
      return item.type === "voice" ? t.voiceSimple : t.audioSimple;
    case "pdf":
      if (item.url) {
        const e = await analyzePdf(item.url, item.caption);
        return e ? t.pdf(e) : t.doc("PDF");
      }
      return t.doc("PDF");
    case "video":
      return item.caption ? t.video(item.caption) : t.videoSimple;
    case "document":
      return t.doc(item.caption || "sin nombre");
    case "sticker":
      return t.sticker;
    case "location":
      return t.location(item.caption || "", "");
    case "contacts":
      return t.contact(item.caption || "");
    case "order":
      return t.order(item.caption || "producto", 1);
    default:
      return t.unsupported(item.type);
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
      return badRequest(getConfig("es").ui.api.missingParam("message o media"));
    }

    if (await isDerived(phone)) {
      return Response.json({ success: true, response: getConfig("es").ui.agent.derivedToHuman, phone, derived: true });
    }

    let text = parts.join("\n");

    if (isRedisConfigured()) {
      await pushMsg(phone, text);
      await new Promise((r) => setTimeout(r, 10000));
      const latest = await peekLatest(phone);
      if (latest !== text) {
        return Response.json({ success: true, response: getConfig("es").ui.agent.queued, phone, queue: true });
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
    const msg = error instanceof Error ? error.message : getConfig("es").ui.api.unknown;
    return serverError(error);
  }
}
