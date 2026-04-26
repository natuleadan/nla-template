import { Suspense } from "react";
import type { Metadata } from "next";
import { PostDetailsSkeleton } from "./post-details-skeleton";
import { PostContent } from "./post-content";
import { getPost } from "@/lib/modules/blog";
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
    const post = await getPost(slug);
    if (!post) return { title: "Artículo no encontrado" };

    const title = `${post.title} | ${brand.name}`;
    const description = post.excerpt?.slice(0, 160) || brand.description;


    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.name,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author],
        url: `${baseUrl}/blog/${slug}`,
        images: [
          {
            url: `${baseUrl}/blog/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: post.title,
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
            url: `${baseUrl}/blog/${slug}/twitter-image`,
            width: 1200,
            height: 600,
            alt: post.title,
          },
        ],
      },
      other: {
        "og:logo": `${baseUrl}/design/logo.svg`,
      },
    };
  } catch {
    return { title: "Artículo no encontrado" };
  }
}

export default async function BlogPostPage({ params }: RouteParams) {
  return (
    <Suspense fallback={<PostDetailsSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}
