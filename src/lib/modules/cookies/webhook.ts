"use server";

import { headers } from "next/headers";
import { getCookieWebhookUrl } from "@/lib/env";

interface CookieConsentPayload {
  consent: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  ip_hash: string;
  country: string;
  user_agent: string;
  timestamp: string;
}

function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export async function notifyCookieConsentWebhook(consent: CookieConsentPayload["consent"]) {
  const webhookUrl = getCookieWebhookUrl();
  if (!webhookUrl) return;

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
    const country = h.get("x-vercel-ip-country") || h.get("cloudfront-viewer-country") || "";
    const userAgent = h.get("user-agent") || "";

    const payload: CookieConsentPayload = {
      consent,
      ip_hash: hashIp(ip),
      country,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail - webhook is optional
  }
}
