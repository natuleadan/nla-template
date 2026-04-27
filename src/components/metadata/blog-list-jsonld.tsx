import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";

interface PostItem {
  title: string;
  url: string;
  image?: string;
}

interface JsonLdBlogListProps {
  name: string;
  total: number;
  posts: PostItem[];
}

export function JsonLdBlogList({ name, total, posts }: JsonLdBlogListProps) {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: post.url,
        name: post.title,
        image: post.image,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
