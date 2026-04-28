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

const WEBHOOK_SECRET = getYcloudWebhookSecret();

function verifySignature(rawBody: string, header: string | null): boolean {
  if (!WEBHOOK_SECRET || !header) return false;
  const parts = header.split(",");
  let ts = "", sig = "";
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k === "t") ts = v;
    if (k === "s") sig = v;
  }
  if (!ts || !sig) return false;
  return crypto.subtle
    .importKey("raw", new TextEncoder().encode(WEBHOOK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    .then((k) => crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`${ts}.${rawBody}`)))
    .then((s) => Array.from(new Uint8Array(s)).map((b) => b.toString(16).padStart(2, "0")).join("") === sig)
    .catch(() => false);
}

interface YCloudWebhookPayload {
  id?: string; type?: string;
  whatsappInboundMessage?: {
    id?: string; wamid?: string; from?: string;
    customerProfile?: { name?: string }; type?: string;
    text?: { body?: string };
    image?: { link?: string; caption?: string; mime_type?: string };
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
  if (m.type === "text" && m.text?.body?.trim()) text = m.text.body;
  else if (m.type === "button" && m.button?.text) text = m.button.text;
  else if (m.type === "interactive") text = m.interactive?.button_reply?.title || m.interactive?.list_reply?.title || "";
  else if (m.type === "location" && m.location) text = `Ubicación: ${m.location.name || ""}`.trim();
  else if (m.type === "request_welcome") text = "Hola, soy nuevo cliente";

  if (!text) return new Response("OK", { status: 200 });

  if (isRedisConfigured()) {
    await pushMsg(aid, text);
    await new Promise((r) => setTimeout(r, 10_000));
    const latest = await peekLatest(aid);
    if (latest !== text) return new Response("OK", { status: 200 });
    const all = await drainAll(aid);
    text = all.join(", ");
    if (isDev) console.log("[YCLOUD] Processing", all.length, "msgs for", aid);
  }

  try {
    const res = await AgentService.processMessage(text, { phone: aid, customerName: name });
    await sendWhatsApp(`+${phone}`, res);
  } catch (err) {
    if (isDev) console.error("[YCLOUD] Error:", err);
    await sendWhatsApp(`+${phone}`, "Lo siento, tuve un problema. Intenta de nuevo.");
  }

  return new Response("OK", { status: 200 });
}
