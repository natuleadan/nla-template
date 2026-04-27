import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { BlogToolbar } from "@/components/blog/blog-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { PostCardSkeleton } from "@/components/blog/post-card-skeleton";
import { Empty } from "@/components/ui/empty";
import { getAllPosts, getPosts } from "@/lib/modules/blog";
import { getCategories } from "@/lib/modules/categories";
import { blog, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdBlogList } from "@/components/metadata/blog-list-jsonld";

async function getInitialData() {
  "use cache";
  cacheLife("hours");
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);
  const initial = await getPosts(1, 6);
  return {
    posts: allPosts,
    categories,
    initialPosts: initial.posts,
    total: initial.total,
    hasMore: initial.hasMore,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { posts } = await getInitialData();
  const baseUrl = getBaseUrl();
  const title = blog.page.metaTitle(posts.length);
  const description = blog.page.metaDescription(posts.length);
  const url = `${baseUrl}/blog`;

  return {
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
          url: `${baseUrl}/blog/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/blog/twitter-image`,
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
}

export default async function BlogPage() {
  const { categories, initialPosts, total, hasMore, posts } =
    await getInitialData();
  const baseUrl = getBaseUrl();

  const jsonLdPosts = posts.map((p) => ({
    title: p.title,
    url: `${baseUrl}/blog/${p.slug}`,
    image: p.image ? `${baseUrl}${p.image}` : undefined,
  }));

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: blog.page.title, item: `${baseUrl}/blog` },
        ]}
      />
      <JsonLdBlogList name={blog.page.title} total={total} posts={jsonLdPosts} />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={blog.page.title}
          description={blog.page.description}
        />
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }>
          {total > 0 ? (
            <BlogToolbar
              initialPosts={initialPosts}
              total={total}
              initialHasMore={hasMore}
              categories={categories}
            />
          ) : (
            <Empty className="py-12">
              <p className="text-muted-foreground">{blog.page.empty}</p>
            </Empty>
          )}
        </Suspense>
      </div>
    </>
  );
}
