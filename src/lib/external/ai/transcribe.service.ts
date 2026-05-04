import { experimental_transcribe as transcribe } from "ai";
import { openai } from "@ai-sdk/openai";
import { getYcloudApiKey, isDev } from "@/lib/env";

export async function transcribeAudio(
  audioLink: string,
): Promise<string | null> {
  if (!audioLink) return null;

  try {
    const url = new URL(audioLink);
    if (
      !url.hostname.endsWith(".ycloud.com") && url.hostname !== "ycloud.com"
    )
      return null;
    const audioRes = await fetch(audioLink, {
      headers: { Authorization: `Bearer ${getYcloudApiKey()}` },
    });
    if (!audioRes.ok) {
      if (isDev)
        console.error(
          "[TRANSCRIBE] Failed to download audio:",
          audioRes.status,
        );
      return null;
    }

    const audioBuffer = await audioRes.arrayBuffer();

    const result = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: new Uint8Array(audioBuffer),
    });

    return result.text || null;
  } catch (err) {
    if (isDev) console.error("[TRANSCRIBE] Error:", err);
    return null;
  }
}
