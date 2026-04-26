import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogHeroImage } from "@/components/blog/blog-hero-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getPost } from "@/lib/modules/blog";
import { blog } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
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
  params: Promise<{ slug: string }>;
}

export async function PostContent({ params }: PostContentProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  const post = await getPost(slug);
  if (!post) return notFound();

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: blog.page.title, item: `${baseUrl}/blog` },
          { name: post.title, item: `${baseUrl}/blog/${slug}` },
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
        url={`${baseUrl}/blog/${slug}`}
        author={post.author}
        publishedAt={post.publishedAt}
        readingTime={post.readingTime}
        breadcrumbs={[
          { name: "Inicio", item: baseUrl },
          { name: blog.page.title, item: `${baseUrl}/blog` },
          { name: post.title, item: `${baseUrl}/blog/${slug}` },
        ]}
      />
      <article className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
            <ShareDialog url={`${baseUrl}/blog/${slug}`} title={post.title} description={post.excerpt} />
            <Link href="/blog" className="ml-auto sm:ml-2">
              <Button variant="outline" size="sm" className="gap-2">
                <IconArrowLeft className="size-4" />
                {blog.post.back}
              </Button>
            </Link>
          </div>
          <div className="order-2 sm:order-1 flex-1">
            <PageHeader title={post.title} description={post.excerpt} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 lg:sticky lg:top-8 lg:self-start">
            <div className="relative aspect-video lg:aspect-auto lg:h-[calc(100vh-12rem)] rounded-lg overflow-hidden">
              <BlogHeroImage
                src={post.image || "/design/fallback.svg"}
                alt={post.title}
                priority
              />
            </div>
          </div>
          <div className="w-full lg:w-3/4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconUser className="size-4" />
                {blog.post.by(post.author)}
              </span>
              <span className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                {blog.post.publishedAt(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <IconClock className="size-4" />
                {blog.post.readingTime(post.readingTime)}
              </span>
            </div>
            <Prose html={post.content} />
          </div>
        </div>
      </article>
    </>
  );
}
