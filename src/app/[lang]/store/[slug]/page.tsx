import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductoContent } from "./producto-content";
import { getProduct, getProductSlugById } from "@/lib/modules/products";
import { brand } from "@/lib/config/site";
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

  try {
    const product = await getProduct(slug, lang);
    if (!product) return { title: getConfig(lang).ui.notFound.product };

    const alternatePaths: Record<string, string> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const altSlug =
        locale === lang ? slug : await getProductSlugById(product.id, locale);
      if (altSlug) alternatePaths[locale] = `/store/${altSlug}`;
    }

    const title = `${product.name} | ${brand.name}`;
    const description =
      product.description?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, alternatePaths, baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.name,
        type: "website",
        url: `${baseUrl}/${lang}/store/${slug}`,
        images: [
          {
            url: `${baseUrl}/${lang}/store/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        locale: getLocaleFromLang(lang),
      },
      other: {
        "og:logo": `${baseUrl}/design/logo.svg`,
        "og:type": "product",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          {
            url: `${baseUrl}/${lang}/store/${slug}/twitter-image`,
            width: 1200,
            height: 600,
            alt: product.name,
          },
        ],
      },
    };
  } catch {
    return { title: getConfig(lang).ui.notFound.product };
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductoContent params={params} />
    </Suspense>
  );
}
