import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { BlogToolbar } from "@/components/blog/blog-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { PostCardSkeleton } from "@/components/blog/post-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { getAllPosts, getPosts } from "@/lib/modules/blog";
import { getBlogCategories } from "@/lib/modules/categories";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdBlogList } from "@/components/metadata/blog-list-jsonld";

async function getInitialData(locale: string) {
  "use cache";
  cacheLife("hours");
  const [allPosts, categories] = await Promise.all([
    getAllPosts(locale),
    getBlogCategories(locale),
  ]);
  const initial = await getPosts(1, 6, locale);
  return {
    posts: allPosts,
    categories,
    initialPosts: initial.posts,
    total: initial.total,
    hasMore: initial.hasMore,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { posts } = await getInitialData(lang);
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();
  const title = cfg.blog.page.metaTitle(posts.length);
  const description = cfg.blog.page.metaDescription(posts.length);
  const url = `${baseUrl}/${lang}/blog`;

  return {
    alternates: getAlternateLanguages(lang, "/blog", baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url,
      images: [
        {
          url: `${baseUrl}/${lang}/blog/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: getLocaleFromLang(lang),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/${lang}/blog/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const { categories, initialPosts, total, hasMore, posts } =
    await getInitialData(lang);
  const baseUrl = getBaseUrl();

  const jsonLdPosts = posts.map((p) => ({
    title: p.title,
    url: `${baseUrl}/${lang}/blog/${p.slug}`,
    image: p.image ? `${baseUrl}${p.image}` : undefined,
  }));

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.blog.page.title, item: `${baseUrl}/${lang}/blog` },
        ]}
      />
      <JsonLdBlogList
        name={cfg.blog.page.title}
        total={total}
        posts={jsonLdPosts}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={cfg.blog.page.title}
          description={cfg.blog.page.description}
        />
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 sm:max-w-xs flex-1" />
                <Skeleton className="h-10 sm:max-w-xs ml-auto w-full sm:w-auto" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          {total > 0 ? (
            <BlogToolbar
              initialPosts={initialPosts}
              total={total}
              initialHasMore={hasMore}
              categories={categories}
            />
          ) : (
            <Empty className="py-12">
              <p className="text-muted-foreground">{cfg.blog.page.empty}</p>
            </Empty>
          )}
        </Suspense>
      </div>
    </>
  );
}
