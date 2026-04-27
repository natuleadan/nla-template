import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductoContent } from "./producto-content";
import { getProduct } from "@/lib/modules/products";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const product = await getProduct(slug);
    if (!product) {
      return { title: "Producto no encontrado" };
    }

    const title = `${product.name} | ${brand.name}`;
    const description = product.description?.slice(0, 160) || brand.description;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.name,
        type: "website",
        url: `${baseUrl}/tienda/${slug}`,
        images: [{ url: `${baseUrl}/tienda/${slug}/opengraph-image`, width: 1200, height: 630, alt: product.name }],
        locale: "es_ES",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [{ url: `${baseUrl}/tienda/${slug}/twitter-image`, width: 1200, height: 600, alt: product.name }],
      },
      other: {
        "og:logo": `${baseUrl}/design/logo.svg`,
      },
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductoPage({ params }: RouteParams) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductoContent params={params} />
    </Suspense>
  );
}
