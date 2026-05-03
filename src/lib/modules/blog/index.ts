import { blogPostsData } from "@/lib/config/data/blog";
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

const posts: BlogPost[] = BlogPostSchema.array().parse([...blogPostsData]);

export async function getPosts(
  page = 1,
  limit = 6,
): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = posts.slice(start, end);
  return {
    posts: paginated,
    total: posts.length,
    hasMore: end < posts.length,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return posts;
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!slug || typeof slug !== "string") return null;
  return posts.find((p) => p.slug === slug) || null;
}
