import { getBaseUrl } from "@/lib/config/env";
import { brand } from "@/lib/config/site";
import { getAllProducts } from "@/lib/modules/products";

export async function GET() {
  try {
    const rawBaseUrl = getBaseUrl();
    const baseUrl = rawBaseUrl.endsWith("/")
      ? rawBaseUrl.slice(0, -1)
      : rawBaseUrl;

    const products = await getAllProducts();

    let content = `# ${brand.name}\n\n`;
    content += `> ${brand.description}\n\n`;
    content += `## Base URL\n`;
    content += `- ${baseUrl}\n\n`;
    content += `## Languages\n`;
    content += `- es (Spanish)\n\n`;

    content += `## Static Pages\n`;
    content += `- [Inicio](${baseUrl}/)\n`;
    content += `- [Tienda](${baseUrl}/tienda)\n`;
    content += `- [Contacto](${baseUrl}/contacto)\n`;
    content += `- [Privacidad](${baseUrl}/privacidad)\n`;
    content += `- [Terminos](${baseUrl}/terminos)\n`;
    content += `- [Datos](${baseUrl}/datos)\n\n`;

    content += `## Products\n`;
    for (const product of products) {
      content += `- [${product.name}](${baseUrl}/tienda/${product.slug})\n`;
    }

    content += `\n## Technical\n`;
    content += `- [Robots.txt](${baseUrl}/robots.txt)\n`;
    content += `- [Sitemap](${baseUrl}/sitemap.xml)\n`;
    content += `- [Web Manifest](${baseUrl}/manifest.webmanifest)\n`;
    content += `- [OpenAPI](${baseUrl}/api)\n`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new Response("Error generating LLM manifest.", { status: 500 });
  }
}
