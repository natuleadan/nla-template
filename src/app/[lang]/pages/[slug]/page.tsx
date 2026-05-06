import { Suspense } from "react";
import type { Metadata } from "next";
import { PaginaDetailsSkeleton } from "./pagina-details-skeleton";
import { PaginaContent } from "./pagina-content";
import { getPagina, getPaginaSlugById } from "@/lib/modules/paginas";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages, SUPPORTED_LOCALES } from "@/lib/locale/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const baseUrl = getBaseUrl();
  const cfg = getConfig(lang);

  try {
    const pageData = await getPagina(slug, lang);
    if (!pageData) return { title: cfg.ui.notFound.page };

    const alternatePaths: Record<string, string> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const altSlug =
        locale === lang ? slug : await getPaginaSlugById(pageData.id, locale);
      if (altSlug) alternatePaths[locale] = `/pages/${altSlug}`;
    }

    const title = `${pageData.title} | ${cfg.brand.name}`;
    const description =
      pageData.excerpt?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, alternatePaths, baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: cfg.brand.name,
        type: "website",
        url: `${baseUrl}/${lang}/pages/${slug}`,
        locale: getLocaleFromLang(lang),
        images: [
          {
            url: `${baseUrl}/${lang}/pages/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          {
            url: `${baseUrl}/${lang}/pages/${slug}/twitter-image`,
            width: 1200,
            height: 600,
            alt: title,
          },
        ],
      },
      other: { "og:logo": `${baseUrl}/design/logo.svg` },
    };
  } catch {
    return { title: getConfig(lang).ui.notFound.page };
  }
}

export default async function PaginaDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return (
    <Suspense fallback={<PaginaDetailsSkeleton />}>
      <PaginaContent params={params} />
    </Suspense>
  );
}
