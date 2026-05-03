import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductoContent } from "./producto-content";
import { getProduct } from "@/lib/modules/products";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const product = await getProduct(slug, lang);
    if (!product) return { title: getConfig(lang).ui.notFound.product };

    const title = `${product.name} | ${brand.name}`;
    const description = product.description?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, `/tienda/${slug}`, baseUrl),
      title, description,
      openGraph: {
        title, description,
        siteName: brand.name, type: "website",
        url: `${baseUrl}/${lang}/tienda/${slug}`,
        images: [{ url: `${baseUrl}/${lang}/tienda/${slug}/opengraph-image`, width: 1200, height: 630, alt: product.name }],
        locale: getLocaleFromLang(lang),
      },
      twitter: {
        card: "summary_large_image",
        title, description,
        images: [{ url: `${baseUrl}/${lang}/tienda/${slug}/twitter-image`, width: 1200, height: 600, alt: product.name }],
      },
      other: { "og:logo": `${baseUrl}/design/logo.svg` },
    };
  } catch {
    return { title: getConfig("en").ui.notFound.product };
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductoContent params={params} />
    </Suspense>
  );
}
