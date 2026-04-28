import sharp from "sharp";
import { generateText } from "@/lib/external/ai/stream.service";
import { aiModel } from "@/lib/external/ai/client";
import { getYcloudApiKey, getZeroDataRetention, isDev } from "@/lib/env";

const MAX_BYTES = 100 * 1024;
const MAX_QUALITY = 80;
const MIN_QUALITY = 10;

async function optimizeImage(buffer: Uint8Array): Promise<Uint8Array> {
  if (buffer.length <= MAX_BYTES) return buffer;

  const img = sharp(buffer);
  const meta = await img.metadata();
  if (!meta || !meta.width) return buffer;

  const ratio = MAX_BYTES / buffer.length;
  let quality = Math.round(MAX_QUALITY * ratio);
  quality = Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, quality));

  let resizeOpts: { width?: number; height?: number } = {};
  if (meta.width > 2000) {
    resizeOpts.width = Math.round(meta.width * Math.sqrt(ratio));
  }

  const compressed = await img
    .jpeg({ quality })
    .resize(resizeOpts)
    .toBuffer();

  if (compressed.length < buffer.length) {
    return new Uint8Array(compressed);
  }

  return buffer;
}

async function downloadMedia(link: string): Promise<Uint8Array | null> {
  const res = await fetch(link, {
    headers: { Authorization: `Bearer ${getYcloudApiKey()}` },
  });
  if (!res.ok) {
    if (isDev) console.error("[MEDIA] Failed to download:", res.status);
    return null;
  }
  return new Uint8Array(await res.arrayBuffer());
}

export async function analyzeImage(imageLink: string, caption?: string): Promise<string | null> {
  if (!imageLink) return null;
  try {
    const raw = await downloadMedia(imageLink);
    if (!raw) return null;

    const optimized = raw.length > MAX_BYTES ? await optimizeImage(raw) : raw;
    if (isDev) console.log("[IMAGE] Compressed:", raw.length, "→", optimized.length, "bytes");

    const prompt = caption
      ? `${caption}. Describe el contenido en español.`
      : "Describe brevemente el contenido de esta imagen en español.";

    const zdr = getZeroDataRetention() ? { gateway: { zeroDataRetention: true } } : undefined;

    const result = await generateText({
      model: aiModel,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: optimized },
        ],
      }],
      ...(zdr && { providerOptions: zdr }),
    });
    return result.text?.trim() || null;
  } catch (err) {
    if (isDev) console.error("[IMAGE] Error:", err);
    return null;
  }
}

export async function analyzePdf(pdfLink: string, caption?: string): Promise<string | null> {
  if (!pdfLink) return null;
  try {
    const raw = await downloadMedia(pdfLink);
    if (!raw) return null;

    const prompt = caption
      ? `${caption}. Extrae todo el texto del documento PDF en español.`
      : "Extrae todo el texto de este documento PDF en español.";

    const result = await generateText({
      model: aiModel,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "file", data: raw, mediaType: "application/pdf" },
        ],
      }],
      ...(getZeroDataRetention() && {
        providerOptions: { gateway: { zeroDataRetention: true } },
      }),
    });
    return result.text?.trim() || null;
  } catch (err) {
    if (isDev) console.error("[PDF] Error:", err);
    return null;
  }
}
