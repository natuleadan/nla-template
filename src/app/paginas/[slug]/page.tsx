import { Suspense } from "react";
import type { Metadata } from "next";
import { PaginaDetailsSkeleton } from "./pagina-details-skeleton";
import { PaginaContent } from "./pagina-content";
import { getPagina } from "@/lib/modules/paginas";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const page = await getPagina(slug);
    if (!page) return { title: "Página no encontrada" };

    const title = `${page.title} | ${brand.name}`;
    const description = page.excerpt?.slice(0, 160) || brand.description;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.name,
        type: "article",
        url: `${baseUrl}/paginas/${slug}`,
        locale: "es_ES",
        images: [
          {
            url: `${baseUrl}/paginas/${slug}/opengraph-image`,
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
            url: `${baseUrl}/paginas/${slug}/twitter-image`,
            width: 1200,
            height: 600,
            alt: title,
          },
        ],
      },
      other: {
        "og:logo": `${baseUrl}/design/logo.svg`,
      },
    };
  } catch {
    return { title: "Página no encontrada" };
  }
}

export default async function PaginaDetailPage({ params }: RouteParams) {
  return (
    <Suspense fallback={<PaginaDetailsSkeleton />}>
      <PaginaContent params={params} />
    </Suspense>
  );
}
