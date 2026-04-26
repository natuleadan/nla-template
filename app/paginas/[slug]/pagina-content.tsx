import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareDialog } from "@/components/ui/share-dialog";
import { IconArrowLeft } from "@tabler/icons-react";
import { Prose } from "@/components/ui/prose";
import { getPagina } from "@/lib/modules/paginas";
import { paginas } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

interface PaginaContentProps {
  params: Promise<{ slug: string }>;
}

export async function PaginaContent({ params }: PaginaContentProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  const page = await getPagina(slug);
  if (!page) return notFound();

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: paginas.page.title, item: `${baseUrl}/paginas` },
          { name: page.title, item: `${baseUrl}/paginas/${slug}` },
        ]}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
            <ShareDialog url={`${baseUrl}/paginas/${slug}`} />
            <Link href="/paginas" className="ml-auto sm:ml-2">
              <Button variant="outline" size="sm" className="gap-2">
                <IconArrowLeft className="size-4" />
                {paginas.detail.back}
              </Button>
            </Link>
          </div>
          <div className="order-2 sm:order-1 flex-1">
            <PageHeader title={page.title} description={page.excerpt} />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="secondary" className="text-xs">
            {page.category === "legal" ? "Legal" : "Políticas"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {paginas.detail.updatedAt(page.updatedAt || page.publishedAt)}
          </span>
        </div>
        <Prose html={page.content} />
      </div>
    </>
  );
}
