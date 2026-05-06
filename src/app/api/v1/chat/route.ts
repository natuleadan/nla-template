import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { validateApiKey } from "@/lib/internal/auth/validate";
import { unauthorized, badRequest, serverError } from "@/lib/api/response";
import { getAdminPhone, getRateLimitMax } from "@/lib/env";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { getConfig } from "@/lib/locale/config";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/client";
import { chatRateLimit } from "@/lib/external/upstash/ratelimit.service";
import {
  pushMsg,
  peekLatest,
  drainAll,
  isDerived,
} from "@/lib/modules/agents/session-store";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";
import { ChatBodySchema, apiError } from "@/lib/api/schemas";

const t = getConfig("es").ui.media;

async function processMediaItem(item: {
  type: string;
  url?: string;
  caption?: string;
}): Promise<string> {
  switch (item.type) {
    case "image":
      if (item.url) {
        const a = await analyzeImage(item.url, item.caption);
        return a
          ? t.image(a)
          : item.caption
            ? t.image(item.caption)
            : t.imageSimple;
      }
      return item.caption ? t.image(item.caption) : t.imageSimple;
    case "audio":
    case "voice":
      if (item.url) {
        const transcript = await transcribeAudio(item.url);
        return item.type === "voice"
          ? transcript
            ? t.voice(transcript)
            : t.voiceSimple
          : transcript
            ? t.audio(transcript)
            : t.audioSimple;
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

const chatInMemoryRl = new RateLimiter({
  maxRequests: getRateLimitMax(),
  windowMs: 60_000,
});

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) return unauthorized();

  const rawIp = getClientIp(req);
  const ipHash = createHash("sha256").update(rawIp).digest("hex").slice(0, 16);

  if (isRedisConfigured()) {
    const { success } = await chatRateLimit.limit(ipHash);
    if (!success) {
      return Response.json(
        { error: `Rate limit: máximo ${getRateLimitMax()} pedidos por minuto` },
        { status: 429 },
      );
    }
  } else {
    const { allowed } = chatInMemoryRl.check(ipHash);
    if (!allowed) {
      return Response.json(
        { error: `Rate limit: máximo ${getRateLimitMax()} pedidos por minuto` },
        { status: 429 },
      );
    }
  }

  try {
    const raw = await req.json().catch(() => ({}));
    const parsed = ChatBodySchema.safeParse(raw);
    if (!parsed.success) return apiError(400, getConfig("es").ui.api.missingParam("message o media"));
    const {
      message,
      phone = "chat_00000000000",
      media,
      mediaUrl,
      mediaCaption,
      mediaItems,
      customerName,
    } = parsed.data;

    const parts: string[] = [];

    if (message) parts.push(message);

    if (mediaItems && mediaItems.length > 0) {
      for (const item of mediaItems) {
        parts.push(await processMediaItem(item));
      }
    } else if (media) {
      parts.push(
        await processMediaItem({
          type: media,
          url: mediaUrl,
          caption: mediaCaption,
        }),
      );
    }

    if (parts.length === 0) {
      return badRequest(getConfig("es").ui.api.missingParam("message o media"));
    }

    if (await isDerived(phone)) {
      return Response.json({
        success: true,
        response: getConfig("es").ui.agent.derivedToHuman,
        phone,
        derived: true,
      });
    }

    let text = parts.join("\n");

    if (isRedisConfigured()) {
      await pushMsg(phone, text);
      await new Promise((r) => setTimeout(r, 10000));
      const latest = await peekLatest(phone);
      if (latest !== text) {
        return Response.json({
          success: true,
          response: getConfig("es").ui.agent.queued,
          phone,
          queue: true,
        });
      }
      const all = await drainAll(phone);
      text = all.join(", ");
    }

    const response = await AgentService.processMessage(text, {
      phone,
      customerName,
      isAdmin: phone === getAdminPhone(),
    });

    const result: Record<string, unknown> = {
      success: true,
      response,
      phone,
      redis: isRedisConfigured(),
      len: response?.length,
    };
    if (media) result.media = media;
    if (typeof response !== "string" || response.length === 0) {
      result.type = typeof response;
    }
    return Response.json(result);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : getConfig("es").ui.api.unknown;
    return serverError(msg);
  }
}
