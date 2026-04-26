import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { TiendaToolbar } from "@/components/products/tienda-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { getAllProducts, getProducts } from "@/lib/modules/products";
import { getCategories } from "@/lib/modules/categories";
import { store, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdProductList } from "@/components/metadata/product-list-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

async function getInitialData() {
  "use cache";
  cacheLife("hours");
  const [allProductsResult, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);
  const initial = await getProducts(1, 3);
  return {
    products: allProductsResult,
    categories,
    initialProducts: initial.products,
    total: initial.total,
    hasMore: initial.hasMore,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { products } = await getInitialData();
  const baseUrl = getBaseUrl();
  const title = store.page.metaTitle(products.length);
  const description = store.page.metaDescription(products.length);
  const url = `${baseUrl}/tienda`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url,
      images: [{ url: `${baseUrl}/tienda/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: `${baseUrl}/tienda/twitter-image`, width: 1200, height: 600, alt: title }],
    },
  };
}

export default async function TiendaPage() {
  const { categories, initialProducts, total, hasMore, products } =
    await getInitialData();
  const baseUrl = getBaseUrl();

  const jsonLdProducts = products.map((p) => ({
    name: p.name,
    url: `${baseUrl}/tienda/${p.slug}`,
    image: p.image ? `${baseUrl}${p.image}` : undefined,
  }));

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: store.page.title, item: `${baseUrl}/tienda` },
        ]}
      />
      <JsonLdProductList
        name={store.page.title}
        products={jsonLdProducts}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={store.page.title}
          description={store.page.description}
        />
        <Suspense fallback={<Skeleton className="h-64" />}>
          {total > 0 ? (
            <TiendaToolbar
              initialProducts={initialProducts}
              total={total}
              initialHasMore={hasMore}
              categories={categories}
            />
          ) : (
            <Empty className="py-12">
              <p className="text-muted-foreground">{store.page.empty}</p>
            </Empty>
          )}
        </Suspense>
      </div>
    </>
  );
}
