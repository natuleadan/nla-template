import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const FONTS_DIR = join(process.cwd(), "src/lib/locale/fonts");

let cachedFont: ArrayBuffer | null = null;

async function getArabicFont(): Promise<ArrayBuffer> {
  if (!cachedFont) {
    const data = await readFile(join(FONTS_DIR, "NotoSansArabic-Bold.ttf"));
    cachedFont = data.buffer.slice(0) as ArrayBuffer;
  }
  return cachedFont;
}

export async function createImageResponse(
  element: React.ReactElement,
  options: { width: number; height: number },
) {
  const arabicFont = await getArabicFont();

  return new ImageResponse(element, {
    ...options,
    fonts: [
      {
        name: "Noto Sans Arabic",
        data: arabicFont,
        weight: 700,
        style: "normal",
      },
    ],
  });
}
