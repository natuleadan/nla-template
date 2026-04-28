import { getAiGatewayApiKey, getYcloudApiKey, isDev } from "@/lib/env";

export async function transcribeAudio(audioLink: string): Promise<string | null> {
  if (!audioLink) return null;

  const apiKey = getAiGatewayApiKey();
  if (!apiKey) {
    if (isDev) console.log("[TRANSCRIBE] No AI_GATEWAY_API_KEY configured");
    return null;
  }

  try {
    const audioRes = await fetch(audioLink, {
      headers: { Authorization: `Bearer ${getYcloudApiKey()}` },
    });
    if (!audioRes.ok) {
      if (isDev) console.error("[TRANSCRIBE] Failed to download audio:", audioRes.status);
      return null;
    }

    const blob = await audioRes.blob();
    const form = new FormData();
    form.append("file", blob, "audio.ogg");
    form.append("model", "whisper-1");
    form.append("language", "es");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!res.ok) {
      if (isDev) console.error("[TRANSCRIBE] Whisper API error:", res.status);
      return null;
    }

    const data = await res.json();
    return (data.text || "").trim() || null;
  } catch (err) {
    if (isDev) console.error("[TRANSCRIBE] Error:", err);
    return null;
  }
}
