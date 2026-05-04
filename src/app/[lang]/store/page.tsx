import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { TiendaToolbar } from "@/components/products/tienda-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { getAllProducts, getProducts } from "@/lib/modules/products";
import { getProductCategories } from "@/lib/modules/categories";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";
import { JsonLdProductList } from "@/components/metadata/product-list-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

async function getInitialData(locale: string) {
  "use cache";
  cacheLife("hours");
  const [allProductsResult, categories] = await Promise.all([
    getAllProducts(locale),
    getProductCategories(locale),
  ]);
  const initial = await getProducts(1, 3, locale);
  return {
    products: allProductsResult,
    categories,
    initialProducts: initial.products,
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
  const { products } = await getInitialData(lang);
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();
  const title = cfg.store.page.metaTitle(products.length);
  const description = cfg.store.page.metaDescription(products.length);
  const url = `${baseUrl}/${lang}/store`;

  return {
    alternates: getAlternateLanguages(lang, "/store", baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url,
      images: [
        {
          url: `${baseUrl}/${lang}/store/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: getLocaleFromLang(lang),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/${lang}/store/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function TiendaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const { categories, initialProducts, total, hasMore, products } =
    await getInitialData(lang);
  const baseUrl = getBaseUrl();

  const jsonLdProducts = products.map((p) => ({
    name: p.name,
    url: `${baseUrl}/${lang}/store/${p.slug}`,
    image: p.image ? `${baseUrl}${p.image}` : undefined,
  }));

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.store.page.title, item: `${baseUrl}/${lang}/store` },
        ]}
      />
      <JsonLdProductList
        name={cfg.store.page.title}
        total={total}
        products={jsonLdProducts}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={cfg.store.page.title}
          description={cfg.store.page.description}
          className="mb-8"
        />
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 sm:max-w-xs flex-1" />
                <Skeleton className="h-10 sm:max-w-xs ml-auto w-full sm:w-auto" />
              </div>
              <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          {total > 0 ? (
            <TiendaToolbar
              initialProducts={initialProducts}
              total={total}
              initialHasMore={hasMore}
              categories={categories}
            />
          ) : (
            <Empty className="py-12">
              <p className="text-muted-foreground">{cfg.store.page.empty}</p>
            </Empty>
          )}
        </Suspense>
      </div>
    </>
  );
}
