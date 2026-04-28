import { NextRequest } from "next/server";
import { getYcloudApiKey, getWhatsappNumber, getYcloudWebhookSecret, isDev } from "@/lib/env";
import {
  Configuration, WhatsappMessagesApi, WhatsappMessageType,
} from "@ycloud-cpaas/ycloud-sdk-node";
import { AgentService } from "@/lib/modules/agents/service";
import {
  isDuplicate, anonymizePhone, pushMsg, peekLatest, drainAll,
} from "@/lib/modules/agents/session-store";
import { isRedisConfigured } from "@/lib/external/upstash/redis";
import { transcribeAudio } from "@/lib/external/ai/transcribe.service";
import { analyzeImage, analyzePdf } from "@/lib/external/ai/image.service";

const WEBHOOK_SECRET = getYcloudWebhookSecret();

async function verifySignature(rawBody: string, header: string | null): Promise<boolean> {
  if (!WEBHOOK_SECRET || !header) return false;
  const parts = header.split(",");
  let ts = "", sig = "";
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k === "t") ts = v;
    if (k === "s") sig = v;
  }
  if (!ts || !sig) return false;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(WEBHOOK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const s = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${ts}.${rawBody}`));
    return Array.from(new Uint8Array(s)).map((b) => b.toString(16).padStart(2, "0")).join("") === sig;
  } catch { return false; }
}

interface MediaMsg {
  link?: string; caption?: string; mime_type?: string; filename?: string;
}

interface YCloudWebhookPayload {
  id?: string; type?: string;
  whatsappInboundMessage?: {
    id?: string; wamid?: string; from?: string;
    customerProfile?: { name?: string }; type?: string;
    text?: { body?: string };
    image?: MediaMsg;
    audio?: MediaMsg & { voice?: boolean };
    video?: MediaMsg;
    document?: MediaMsg & { filename?: string };
    voice?: MediaMsg;
    sticker?: MediaMsg;
    reaction?: { emoji?: string; message_id?: string };
    order?: { product_id?: string; quantity?: number };
    system?: { body?: string };
    button?: { payload?: string; text?: string };
    interactive?: { type?: string; button_reply?: { id?: string; title?: string }; list_reply?: { id?: string; title?: string; description?: string } };
    location?: { latitude?: number; longitude?: number; name?: string; address?: string };
  };
}

function sendWhatsApp(to: string, message: string): Promise<boolean> {
  const apiKey = getYcloudApiKey();
  const from = getWhatsappNumber();
  if (!apiKey || !from) return Promise.resolve(false);
  return new WhatsappMessagesApi(new Configuration({ apiKey }))
    .sendDirectly({ from, to, type: WhatsappMessageType.Text, text: { body: message } })
    .then(() => true).catch(() => false);
}

function markAsRead(id: string): void {
  const k = getYcloudApiKey();
  if (!k) return;
  fetch(`https://api.ycloud.com/v2/whatsapp/inboundMessages/${id}/typingIndicator`, {
    method: "POST", headers: { "X-API-Key": k },
  }).catch(() => {});
}

export async function GET(req: NextRequest) {
  const s = new URL(req.url).searchParams.get("secret");
  if (!s) return new Response("Missing secret", { status: 400 });
  if (!WEBHOOK_SECRET) return new Response("Not configured", { status: 500 });
  if (s !== WEBHOOK_SECRET) return new Response("Invalid", { status: 403 });
  return new Response(s, { status: 200 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("ycloud-signature");
  if (WEBHOOK_SECRET && sig && !(await verifySignature(raw, sig))) {
    return new Response("Bad signature", { status: 403 });
  }

  let p: YCloudWebhookPayload;
  try { p = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
  if (p.type !== "whatsapp.inbound_message.received") return new Response("OK", { status: 200 });

  const m = p.whatsappInboundMessage;
  if (!m || !m.from) return new Response("OK", { status: 200 });
  if (m.wamid && (await isDuplicate(m.wamid))) return new Response("OK", { status: 200 });

  const phone = m.from.replace("+", "");
  const aid = await anonymizePhone(phone);
  const name = m.customerProfile?.name;
  if (m.wamid || m.id) markAsRead(m.wamid || m.id!);

  let text = "";
  const t = m.type || "";
  if (t === "text" && m.text?.body?.trim()) {
    text = m.text.body;
  } else if (t === "button" && m.button?.text) {
    text = m.button.text;
  } else if (t === "interactive") {
    text = m.interactive?.button_reply?.title || m.interactive?.list_reply?.title || "";
  } else if (t === "location" && m.location) {
    text = `[Ubicación: ${[m.location.name, m.location.address].filter(Boolean).join(", ")}]`.trim();
  } else if (t === "request_welcome") {
    text = "Hola, soy nuevo cliente";
  } else if (t === "image" && m.image) {
    const analyzed = await analyzeImage(m.image.link || "", m.image.caption);
    text = analyzed ? `[Imagen: ${analyzed}]` : (m.image.caption ? `[Imagen: ${m.image.caption}]` : "[Imagen]");
  } else if (t === "audio" && m.audio) {
    const transcribed = await transcribeAudio(m.audio.link || "");
    text = transcribed ? `[Audio transcrito: ${transcribed}]` : "[Audio]";
  } else if (t === "voice" && m.voice) {
    const transcribed = await transcribeAudio(m.voice.link || "");
    text = transcribed ? `[Nota de voz transcrita: ${transcribed}]` : "[Nota de voz]";
  } else if (t === "video") {
    text = m.video?.caption ? `[Video: ${m.video.caption}]` : "[Video]";
  } else if (t === "document" && m.document) {
    if (m.document.mime_type === "application/pdf" && m.document.link) {
      const extracted = await analyzePdf(m.document.link, m.document.caption);
      text = extracted ? `[PDF extraído: ${extracted}]` : `[Documento: ${m.document.filename || "PDF"}]`;
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
  } else if (t === "contacts" && m.contacts?.length) {
    const parts = m.contacts.map((c: { name?: { formatted_name?: string }; phones?: Array<{ phone?: string }> }) => {
      const n = c.name?.formatted_name || "";
      const p = c.phones?.map((ph) => ph.phone).filter(Boolean).join(", ") || "";
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
    if (isDev) console.log("[YCLOUD] Processing", all.length, "msgs for", aid);
  }

  try {
    const res = await AgentService.processMessage(text, { phone, customerName: name });
    await sendWhatsApp(`+${phone}`, res);
  } catch (err) {
    if (isDev) console.error("[YCLOUD] Error:", err);
    await sendWhatsApp(`+${phone}`, "Lo siento, tuve un problema. Intenta de nuevo.");
  }

  return new Response("OK", { status: 200 });
}
