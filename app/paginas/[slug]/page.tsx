import { Suspense } from "react";
import type { Metadata } from "next";
import { PaginaDetailsSkeleton } from "./pagina-details-skeleton";
import { PaginaContent } from "./pagina-content";
import { getPagina } from "@/lib/modules/paginas";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

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
      },
      twitter: {
        card: "summary",
        title,
        description,
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
