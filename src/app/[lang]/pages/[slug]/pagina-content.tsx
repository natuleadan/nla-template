import { cacheLife } from "next/cache";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogAttachments } from "@/components/blog/blog-attachments";
import { ShareDialog } from "@/components/ui/share-dialog";
import { IconArrowLeft } from "@tabler/icons-react";
import { Prose } from "@/components/ui/prose";
import { getPagina } from "@/lib/modules/paginas";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { resolveSlug } from "@/lib/locale/slug-resolver";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdWebPage } from "@/components/metadata/page-jsonld";

interface PaginaContentProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function PaginaContent({ params }: PaginaContentProps) {
  "use cache";
  cacheLife("hours");
  const { lang, slug } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();

  const { data: pageData } = await resolveSlug(
    slug,
    lang,
    getPagina,
    "/pages",
  );

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.paginas.page.title, item: `${baseUrl}/${lang}/pages` },
          { name: pageData.title, item: `${baseUrl}/${lang}/pages/${slug}` },
        ]}
      />
      <JsonLdWebPage
        pageUrl={`${baseUrl}/${lang}/pages/${slug}`}
        pageName={pageData.title}
        pageDescription={pageData.excerpt}
        datePublished={pageData.publishedAt}
        dateModified={pageData.updatedAt}
        locale={lang}
        breadcrumbs={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.paginas.page.title, item: `${baseUrl}/${lang}/pages` },
          { name: pageData.title, item: `${baseUrl}/${lang}/pages/${slug}` },
        ]}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
            <ShareDialog
              url={`${baseUrl}/${lang}/pages/${slug}`}
              title={pageData.title}
              description={pageData.excerpt}
            />
            <Link href={`/${lang}/pages`} className="ml-auto sm:ml-2">
              <Button variant="outline" size="sm" className="gap-2">
                <IconArrowLeft className="size-4" />
                {cfg.paginas.detail.back}
              </Button>
            </Link>
          </div>
          <div className="order-2 sm:order-1 flex-1">
            <PageHeader title={pageData.title} description={pageData.excerpt} />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="secondary" className="text-xs">
            {pageData.category === "legal"
              ? cfg.paginas.category.legal
              : cfg.paginas.category.politicas}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {cfg.paginas.detail.updatedAt(
              pageData.updatedAt || pageData.publishedAt,
            )}
          </span>
        </div>
        <Prose html={pageData.content} />
        {pageData.attachments && pageData.attachments.length > 0 && (
          <div className="mt-8">
            <BlogAttachments title={cfg.paginas.detail.attachmentsLabel} attachments={pageData.attachments} columns={3} />
          </div>
        )}
      </div>
    </>
  );
}
