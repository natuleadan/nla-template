import { getBaseUrl, isDev } from "@/lib/env";
import { getAllProducts } from "@/lib/modules/products";

const LOCALES = ["es", "en"];

export async function GET() {
  try {
    const rawBaseUrl = getBaseUrl();
    const baseUrl = rawBaseUrl.endsWith("/")
      ? rawBaseUrl.slice(0, -1)
      : rawBaseUrl;

    const lines: string[] = [];

    lines.push(`# Acme Inc`);
    lines.push(``);
    lines.push(`> Your trusted online store. Curated products for your home and office.`);
    lines.push(``);
    lines.push(`## Base URL`);
    lines.push(`- ${baseUrl}`);
    lines.push(``);
    lines.push(`## Languages`);
    lines.push(`- es (Spanish)`);
    lines.push(`- en (English)`);
    lines.push(``);

    for (const locale of LOCALES) {
      const label = locale === "es" ? "Spanish" : "English";
      lines.push(`## ${label}`);

      const products = await getAllProducts(locale);

      lines.push(`### Static Pages`);
      lines.push(`- [Home / Inicio](${baseUrl}/${locale}/)`);
      lines.push(`- [Store / Tienda](${baseUrl}/${locale}/tienda)`);
      lines.push(`- [Blog](${baseUrl}/${locale}/blog)`);
      lines.push(`- [Agenda](${baseUrl}/${locale}/agenda)`);
      lines.push(`- [Pages / Páginas](${baseUrl}/${locale}/paginas)`);
      lines.push(`- [Contact / Contacto](${baseUrl}/${locale}/contacto)`);
      lines.push(`- [Privacy / Privacidad](${baseUrl}/${locale}/paginas/privacidad)`);
      lines.push(`- [Terms / Términos](${baseUrl}/${locale}/paginas/terminos)`);
      lines.push(`- [Data / Datos](${baseUrl}/${locale}/datos)`);
      lines.push(``);

      lines.push(`### Products`);
      for (const product of products) {
        lines.push(`- [${product.name}](${baseUrl}/${locale}/tienda/${product.slug})`);
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
