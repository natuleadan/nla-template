import { cacheLife } from "next/cache";
import Link from "next/link";
import { BlogHeroImage } from "@/components/blog/blog-hero-image";
import { BlogAttachments } from "@/components/blog/blog-attachments";
import { BlogComments } from "@/components/blog/blog-comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getPost } from "@/lib/modules/blog";
import { getComments } from "@/lib/modules/comments";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { resolveSlug } from "@/lib/locale/slug-resolver";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdBlogPost } from "@/components/metadata/blog-post-jsonld";
import { ShareDialog } from "@/components/ui/share-dialog";
import { Prose } from "@/components/ui/prose";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconUser,
} from "@tabler/icons-react";

interface PostContentProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function PostContent({ params }: PostContentProps) {
  "use cache";
  cacheLife("hours");
  const { lang, slug } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();

  const { data: post } = await resolveSlug(slug, lang, getPost, "/news");
  const comments = await getComments(slug, lang);
  const catLabels = Object.fromEntries(
    (cfg.blogCategories || []).map((c: { slug: string; name: string }) => [
      c.slug,
      c.name,
    ]),
  );

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.blog.page.title, item: `${baseUrl}/${lang}/news` },
          { name: post.title, item: `${baseUrl}/${lang}/news/${slug}` },
        ]}
      />
      <JsonLdBlogPost
        title={post.title}
        description={post.excerpt}
        image={
          post.image
            ? `${baseUrl}${post.image}`
            : `${baseUrl}/design/fallback.svg`
        }
        url={`${baseUrl}/${lang}/news/${slug}`}
        author={post.author}
        publishedAt={post.publishedAt}
        dateModified={post.updatedAt}
        readingTime={post.readingTime}
        locale={lang}
        breadcrumbs={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.blog.page.title, item: `${baseUrl}/${lang}/news` },
          { name: post.title, item: `${baseUrl}/${lang}/news/${slug}` },
        ]}
      />
      <article className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
            <ShareDialog
              url={`${baseUrl}/${lang}/news/${slug}`}
              title={post.title}
              description={post.excerpt}
            />
            <Link href={`/${lang}/news`} className="ml-auto sm:ml-2">
              <Button variant="outline" size="sm" className="gap-2">
                <IconArrowLeft className="size-4" />
                {cfg.blog.post.back}
              </Button>
            </Link>
          </div>
          <div className="order-2 sm:order-1 flex-1">
            <PageHeader title={post.title} description={post.excerpt} />
          </div>
        </div>
        <div className="md:flex md:gap-8 lg:gap-12 md:items-start">
          <div className="md:w-80 lg:w-96 shrink-0 mb-6 md:mb-0">
            <div className="relative aspect-video md:aspect-[3/4] rounded-lg overflow-hidden">
              <BlogHeroImage
                src={post.image || "/design/fallback.svg"}
                alt={post.title}
                priority
              />
            </div>
            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-6">
                <BlogAttachments attachments={post.attachments} />
              </div>
            )}
          </div>
          <div className="md:flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {catLabels[post.category] || post.category}
              </Badge>
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconUser className="size-4" />
                {cfg.blog.post.by(post.author)}
              </span>
              <span className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                {cfg.blog.post.publishedAt(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <IconClock className="size-4" />
                {cfg.blog.post.readingTime(post.readingTime)}
              </span>
            </div>
            <Prose html={post.content} />
            <BlogComments postSlug={slug} initialComments={comments} />
          </div>
        </div>
      </article>
    </>
  );
}
