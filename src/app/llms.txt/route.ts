import { getBaseUrl, isDev } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { detectLocale } from "@/lib/locale/detect";
import { getAllProducts } from "@/lib/modules/products";
import { LOCALES } from "@/lib/locale/locales";

const LABELS: Record<string, string> = {
  es: "Spanish",
  en: "English",
  ar: "Arabic",
};

export async function GET() {
  try {
    const rawBaseUrl = getBaseUrl();
    const baseUrl = rawBaseUrl.endsWith("/")
      ? rawBaseUrl.slice(0, -1)
      : rawBaseUrl;

    const lang = await detectLocale();
    const cfg = getConfig(lang);
    const lines: string[] = [];

    lines.push(`# ${cfg.brand.name}`);
    lines.push(``);
    lines.push(`> ${cfg.brand.description}`);
    lines.push(``);
    lines.push(`## Base URL`);
    lines.push(`- ${baseUrl}`);
    lines.push(``);
    lines.push(`## Languages`);
    for (const locale of LOCALES) {
      lines.push(`- ${locale} (${LABELS[locale] || locale})`);
    }
    lines.push(``);

    for (const locale of LOCALES) {
      const label = LABELS[locale] || locale;
      lines.push(`## ${label}`);

      const products = await getAllProducts(locale);

      lines.push(`### Static Pages`);
      lines.push(`- [Home / Inicio](${baseUrl}/${locale}/)`);
      lines.push(`- [Store / Tienda](${baseUrl}/${locale}/store)`);
      lines.push(`- [Blog](${baseUrl}/${locale}/news)`);
      lines.push(`- [Agenda](${baseUrl}/${locale}/schedule)`);
      lines.push(`- [Pages / Páginas](${baseUrl}/${locale}/pages)`);
      lines.push(`- [Contact / Contacto](${baseUrl}/${locale}/contact)`);
      lines.push(
        `- [Privacy / Privacidad](${baseUrl}/${locale}/pages/privacidad)`,
      );
      lines.push(`- [Terms / Términos](${baseUrl}/${locale}/pages/terminos)`);
      lines.push(`- [Data / Datos](${baseUrl}/${locale}/datos)`);
      lines.push(``);

      lines.push(`### Products`);
      for (const product of products) {
        lines.push(
          `- [${product.name}](${baseUrl}/${locale}/store/${product.slug})`,
        );
      }
      lines.push(``);
    }

    lines.push(`## Technical`);
    lines.push(`- [Robots.txt](${baseUrl}/robots.txt)`);
    lines.push(`- [Sitemap](${baseUrl}/sitemap.xml)`);
    lines.push(`- [Web Manifest](${baseUrl}/manifest.webmanifest)`);
    lines.push(`- [OpenAPI](${baseUrl}/api)`);

    const content = lines.join("\n");

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    if (isDev) console.error("Error generating llms.txt:", error);
    return new Response("Error generating LLM manifest.", { status: 500 });
  }
}
