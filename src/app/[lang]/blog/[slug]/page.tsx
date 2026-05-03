import { Suspense } from "react";
import type { Metadata } from "next";
import { PostDetailsSkeleton } from "./post-details-skeleton";
import { PostContent } from "./post-content";
import { getPost } from "@/lib/modules/blog";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const post = await getPost(slug, lang);
    if (!post) return { title: "Article not found" };

    const title = `${post.title} | ${brand.name}`;
    const description = post.excerpt?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, `/blog/${slug}`, baseUrl),
      title, description,
      openGraph: {
        title, description,
        siteName: brand.name, type: "article",
        publishedTime: post.publishedAt, authors: [post.author],
        url: `${baseUrl}/${lang}/blog/${slug}`,
        images: [{ url: `${baseUrl}/${lang}/blog/${slug}/opengraph-image`, width: 1200, height: 630, alt: post.title }],
        locale: getLocaleFromLang(lang),
      },
      twitter: {
        card: "summary_large_image", title, description,
        images: [{ url: `${baseUrl}/${lang}/blog/${slug}/twitter-image`, width: 1200, height: 600, alt: post.title }],
      },
      other: { "og:logo": `${baseUrl}/design/logo.svg` },
    };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  return (
    <Suspense fallback={<PostDetailsSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}
