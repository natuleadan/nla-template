import { blogPostsData as blogPostsDataEs } from "@/lib/config/data/blog.es";
import { blogPostsData as blogPostsDataEn } from "@/lib/config/data/blog.en";
import { BlogPostSchema } from "./schemas";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
}

const posts = {
  es: BlogPostSchema.array().parse([...blogPostsDataEs]),
  en: BlogPostSchema.array().parse([...blogPostsDataEn]),
};

function getData(locale = "es") {
  return posts[locale as keyof typeof posts] || posts.es;
}

export async function getPosts(
  page = 1,
  limit = 6,
  locale = "es",
): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
  const data = getData(locale);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = data.slice(start, end);
  return {
    posts: paginated,
    total: data.length,
    hasMore: end < data.length,
  };
}

export async function getAllPosts(locale = "es"): Promise<BlogPost[]> {
  return getData(locale);
}

export async function getPost(
  slug: string,
  locale = "es",
): Promise<BlogPost | null> {
  if (!slug || typeof slug !== "string") return null;
  return getData(locale).find((p) => p.slug === slug) || null;
}

export async function getPostSlugById(
  id: string,
  locale = "es",
): Promise<string | undefined> {
  return getData(locale).find((p) => p.id === id)?.slug;
}
