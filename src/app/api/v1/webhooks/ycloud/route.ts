import { NextRequest } from "next/server";
import {
  getYcloudApiKey,
  getYcloudEnabled,
  getYcloudWebhookSecret,
  getAdminPhone,
  isDev,
} from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { sendWhatsApp } from "@/lib/external/whatsapp/send";
import { AgentService } from "@/lib/modules/agents/service";
import {
  isDuplicate,
  pushMsg,
  peekLatest,
  drainAll,
  isDerived,
} from "@/lib/modules/agents/session-store";
import { isRedisConfigured } from "@/lib/external/upstash/client";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";
import { YCloudWebhookPayloadSchema, apiError } from "@/lib/api/schemas";

const WEBHOOK_SECRET = getYcloudWebhookSecret();

async function verifySignature(
  rawBody: string,
  header: string | null,
): Promise<boolean> {
  if (!WEBHOOK_SECRET || !header) return false;
  const parts = header.split(",");
  let ts = "",
    sig = "";
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k === "t") ts = v;
    if (k === "s") sig = v;
  }
  if (!ts || !sig) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const s = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${ts}.${rawBody}`),
    );
    return (
      Array.from(new Uint8Array(s))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("") === sig
    );
  } catch {
    return false;
  }
}

function markAsRead(id: string): void {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return;
  const k = getYcloudApiKey();
  if (!k) return;
  fetch(
    `https://api.ycloud.com/v2/whatsapp/inboundMessages/${id}/typingIndicator`,
    {
      method: "POST",
      headers: { "X-API-Key": k },
    },
  ).catch(() => {});
}

export async function GET(req: NextRequest) {
  if (!getYcloudEnabled()) {
    return new Response(getConfig("es").ui.whatsapp.send.ycloudDisabled, {
      status: 501,
    });
  }
  const s = new URL(req.url).searchParams.get("secret");
  if (!s) return new Response("Missing secret", { status: 400 });
  if (!WEBHOOK_SECRET) return new Response("Not configured", { status: 500 });
  if (s !== WEBHOOK_SECRET) return new Response("Invalid", { status: 403 });
  return new Response(s, { status: 200 });
}

export async function POST(req: NextRequest) {
  if (!getYcloudEnabled()) {
    return new Response(getConfig("es").ui.whatsapp.send.ycloudDisabled, {
      status: 501,
    });
  }
  const raw = await req.text();
  const sig = req.headers.get("ycloud-signature");
  if (WEBHOOK_SECRET && sig && !(await verifySignature(raw, sig))) {
    return new Response("Bad signature", { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return apiError(400, "Bad JSON");
  }
  const parsed = YCloudWebhookPayloadSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Webhook inválido");
  const p = parsed.data;
  if (p.type !== "whatsapp.inbound_message.received")
    return new Response("OK", { status: 200 });

  const m = p.whatsappInboundMessage;
  if (!m || !m.from) return new Response("OK", { status: 200 });
  if (m.wamid && (await isDuplicate(m.wamid)))
    return new Response("OK", { status: 200 });

  const phone = m.from.replace("+", "");

  if (await isDerived(phone)) return new Response("OK", { status: 200 });
  const name = m.customerProfile?.name;

  let text = "";
  const t = m.type || "";
  if (t === "text" && m.text?.body?.trim()) {
    text = m.text.body;
  } else if (t === "button" && m.button?.text) {
    text = m.button.text;
  } else if (t === "interactive") {
    text =
      m.interactive?.button_reply?.title ||
      m.interactive?.list_reply?.title ||
      "";
  } else if (t === "location" && m.location) {
    text =
      `[Ubicación: ${[m.location.name, m.location.address].filter(Boolean).join(", ")}]`.trim();
    if (m.location.latitude && m.location.longitude) {
      text += ` (GPS: ${m.location.latitude}, ${m.location.longitude})`;
    }
  } else if (t === "request_welcome") {
    text = getConfig("es").ui.media.welcomeText;
  } else if (t === "image" && m.image) {
    const analyzed = await analyzeImage(m.image.link || "", m.image.caption);
    text = analyzed
      ? `[Imagen: ${analyzed}]`
      : m.image.caption
        ? `[Imagen: ${m.image.caption}]`
        : "[Imagen]";
  } else if (t === "audio" && m.audio) {
    const transcribed = await transcribeAudio(m.audio.link || "");
    text = transcribed ? `[Audio transcrito: ${transcribed}]` : "[Audio]";
  } else if (t === "voice" && m.voice) {
    const transcribed = await transcribeAudio(m.voice.link || "");
    text = transcribed
      ? `[Nota de voz transcrita: ${transcribed}]`
      : "[Nota de voz]";
  } else if (t === "video") {
    text = m.video?.caption ? `[Video: ${m.video.caption}]` : "[Video]";
  } else if (t === "document" && m.document) {
    if (m.document.mime_type === "application/pdf" && m.document.link) {
      const extracted = await analyzePdf(m.document.link, m.document.caption);
      text = extracted
        ? `[PDF extraído: ${extracted}]`
        : `[Documento: ${m.document.filename || "PDF"}]`;
    } else {
      text = `[Documento: ${m.document.filename || "sin nombre"}]`;
    }
  } else if (t === "sticker") {
    text = "[Sticker]";
  } else if (t === "reaction") {
    // Ignorar reacciones, no necesitan respuesta del agente
    return new Response("OK", { status: 200 });
  } else if (t === "order" && m.order) {
    text = `[Pedido: producto ${m.order.product_id || "desconocido"}, cantidad ${m.order.quantity || 1}]`;
  } else if (t === "system" && m.system) {
    text = `[Sistema: ${m.system.body || "evento del sistema"}]`;
  } else if (
    t === "contacts" &&
    (
      m as {
        contacts?: Array<{
          name?: { formatted_name?: string };
          phones?: Array<{ phone?: string }>;
        }>;
      }
    ).contacts?.length
  ) {
    const parts = (
      m as {
        contacts?: Array<{
          name?: { formatted_name?: string };
          phones?: Array<{ phone?: string }>;
        }>;
      }
    ).contacts!.map((c) => {
      const n = c.name?.formatted_name || "";
      const p =
        c.phones
          ?.map((ph) => ph.phone)
          .filter(Boolean)
          .join(", ") || "";
      return [n, p].filter(Boolean).join(" - ");
    });
    text = `[Contacto: ${parts.join("; ")}]`;
  } else {
    text = `[Mensaje tipo "${t}" no soportado]`;
  }

  if (!text) return new Response("OK", { status: 200 });

  if (isRedisConfigured()) {
    await pushMsg(phone, text);
    await new Promise((r) => setTimeout(r, 10000));
    const latest = await peekLatest(phone);
    if (latest !== text) return new Response("OK", { status: 200 });
    const all = await drainAll(phone);
    text = all.join(", ");
    if (isDev) console.log("[YCLOUD] Processing", all.length, "msgs");
  }

  // Show typing indicator only when actually about to process (after media + queue)
  const msgId = m.wamid || m.id;
  if (msgId) markAsRead(msgId);

  try {
    const response = await AgentService.processMessage(text, {
      phone,
      customerName: name,
      isAdmin: phone === getAdminPhone(),
    });
    await sendWhatsApp(`+${phone}`, response);
  } catch (err) {
    if (isDev)
      console.error(
        "[YCLOUD] Error:",
        err instanceof Error ? err.message : err,
      );
    await sendWhatsApp(`+${phone}`, getConfig("es").ui.agent.sendError);
  }

  return new Response("OK", { status: 200 });
}
