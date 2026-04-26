import { blogPostsData } from "@/lib/config/blog";

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

const posts: BlogPost[] = [...blogPostsData];

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

export async function createPost(
  data: Record<string, unknown>,
): Promise<BlogPost | null> {
  if (!data.title) return null;
  const id = String(posts.length + 1);
  const slug = String(data.title).toLowerCase().replace(/\s+/g, "-");
  const post: BlogPost = {
    id,
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt || ""),
    content: String(data.content || ""),
    image: String(data.image || ""),
    author: String(data.author || ""),
    category: String(data.category || ""),
    tags: data.tags as string[] | undefined,
    publishedAt: String(
      data.publishedAt || new Date().toISOString().split("T")[0],
    ),
    readingTime: Number(data.readingTime) || 1,
  };
  posts.push(post);
  return post;
}

export async function deletePost(slug: string): Promise<boolean> {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  return true;
}

export async function clearPosts(): Promise<void> {
  posts.length = 0;
}
