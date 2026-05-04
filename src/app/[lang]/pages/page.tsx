import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PaginaCardSkeleton } from "@/components/paginas/pagina-card-skeleton";
import { Empty } from "@/components/ui/empty";
import { PaginaToolbar } from "@/components/paginas/pagina-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPaginas, getPaginas } from "@/lib/modules/paginas";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdPaginasList } from "@/components/metadata/paginas-list-jsonld";

async function getInitialData(locale: string) {
  "use cache";
  cacheLife("hours");
  const cfg = getConfig(locale);
  const allPages = await getAllPaginas(locale);
  const initial = await getPaginas(1, 6, locale);
  const categories = [
    { slug: "legal", name: cfg.paginas.category.legal },
    { slug: "politicas", name: cfg.paginas.category.politicas },
  ];
  return {
    pages: allPages,
    categories,
    initialPages: initial.pages,
    total: initial.total,
    hasMore: initial.hasMore,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { pages } = await getInitialData(lang);
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();
  const title = cfg.paginas.page.metaTitle(pages.length);
  const description = cfg.paginas.page.metaDescription(pages.length);
  const url = `${baseUrl}/${lang}/pages`;

  return {
    alternates: getAlternateLanguages(lang, "/pages", baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url,
      locale: getLocaleFromLang(lang),
      images: [
        {
          url: `${baseUrl}/${lang}/pages/opengraph-image`,
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
          url: `${baseUrl}/${lang}/pages/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function PaginasPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const { categories, initialPages, total, hasMore, pages } =
    await getInitialData(lang);
  const baseUrl = getBaseUrl();

  const jsonLdPages = pages.map((p) => ({
    title: p.title,
    url: `${baseUrl}/${lang}/pages/${p.slug}`,
  }));

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.paginas.page.title, item: `${baseUrl}/${lang}/pages` },
        ]}
      />
      <JsonLdPaginasList
        name={cfg.paginas.page.title}
        total={total}
        pages={jsonLdPages}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={cfg.paginas.page.title}
          description={cfg.paginas.page.description}
          className="mb-8"
        />
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 sm:max-w-xs flex-1" />
                <Skeleton className="h-10 sm:max-w-xs ml-auto w-full sm:w-auto" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PaginaCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          {total > 0 ? (
            <PaginaToolbar
              initialPages={initialPages}
              total={total}
              initialHasMore={hasMore}
              categories={categories}
            />
          ) : (
            <Empty className="py-12">
              <p className="text-muted-foreground">{cfg.paginas.page.empty}</p>
            </Empty>
          )}
        </Suspense>
      </div>
    </>
  );
}
