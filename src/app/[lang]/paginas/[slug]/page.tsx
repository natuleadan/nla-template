import { Suspense } from "react";
import type { Metadata } from "next";
import { PaginaDetailsSkeleton } from "./pagina-details-skeleton";
import { PaginaContent } from "./pagina-content";
import { getPagina } from "@/lib/modules/paginas";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const pageData = await getPagina(slug, lang);
    if (!pageData) return { title: "Page not found" };

    const title = `${pageData.title} | ${brand.name}`;
    const description = pageData.excerpt?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, `/paginas/${slug}`, baseUrl),
      title, description,
      openGraph: {
        title, description,
        siteName: brand.name, type: "article",
        url: `${baseUrl}/${lang}/paginas/${slug}`,
        locale: getLocaleFromLang(lang),
        images: [{ url: `${baseUrl}/${lang}/paginas/${slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image", title, description,
        images: [{ url: `${baseUrl}/${lang}/paginas/${slug}/twitter-image`, width: 1200, height: 600, alt: title }],
      },
      other: { "og:logo": `${baseUrl}/design/logo.svg` },
    };
  } catch {
    return { title: "Page not found" };
  }
}

export default async function PaginaDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  return (
    <Suspense fallback={<PaginaDetailsSkeleton />}>
      <PaginaContent params={params} />
    </Suspense>
  );
}
