import { Suspense } from "react";
import type { Metadata } from "next";
import { PostDetailsSkeleton } from "./post-details-skeleton";
import { PostContent } from "./post-content";
import { getPost, getPostSlugById } from "@/lib/modules/blog";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages, SUPPORTED_LOCALES } from "@/lib/locale/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const post = await getPost(slug, lang);
    if (!post) return { title: getConfig(lang).ui.notFound.article };

    const alternatePaths: Record<string, string> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const altSlug =
        locale === lang ? slug : await getPostSlugById(post.id, locale);
      if (altSlug) alternatePaths[locale] = `/news/${altSlug}`;
    }

    const title = `${post.title} | ${brand.name}`;
    const description =
      post.excerpt?.slice(0, 160) || getConfig(lang).brand.description;

    return {
      alternates: getAlternateLanguages(lang, alternatePaths, baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.name,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author],
        url: `${baseUrl}/${lang}/news/${slug}`,
        images: [
          {
            url: `${baseUrl}/${lang}/news/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: post.title,
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
            url: `${baseUrl}/${lang}/news/${slug}/twitter-image`,
            width: 1200,
            height: 600,
            alt: post.title,
          },
        ],
      },
      other: { "og:logo": `${baseUrl}/design/logo.svg` },
    };
  } catch {
    return { title: getConfig(lang).ui.notFound.article };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return (
    <Suspense fallback={<PostDetailsSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}
