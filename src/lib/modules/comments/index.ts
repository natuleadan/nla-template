import { commentsData as seedData } from "@/lib/config/data/comments";
import { CommentSchema } from "./schemas";

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  comment: string;
  createdAt: string;
  status: "pending" | "approved";
  visibility?: "public" | "private";
  phone?: string;
}

const comments: Comment[] = CommentSchema.array().parse(seedData);

export async function getComments(postSlug: string): Promise<Comment[]> {
  if (!postSlug || typeof postSlug !== "string") return [];
  return comments.filter((c) => c.postSlug === postSlug);
}

export async function getApprovedComments(postSlug: string): Promise<Comment[]> {
  return comments.filter((c) => c.postSlug === postSlug && c.status === "approved" && c.visibility !== "private");
}
