import { commentsData as commentsDataEs } from "@/lib/config/data/comments.es";
import { commentsData as commentsDataEn } from "@/lib/config/data/comments.en";
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

const allComments = {
  es: CommentSchema.array().parse(commentsDataEs),
  en: CommentSchema.array().parse(commentsDataEn),
};

function getData(locale = "es") {
  return allComments[locale as keyof typeof allComments] || allComments.es;
}

export async function getComments(postSlug: string, locale = "es"): Promise<Comment[]> {
  if (!postSlug || typeof postSlug !== "string") return [];
  return getData(locale).filter((c) => c.postSlug === postSlug);
}

export async function getApprovedComments(postSlug: string, locale = "es"): Promise<Comment[]> {
  return getData(locale).filter((c) => c.postSlug === postSlug && c.status === "approved" && c.visibility !== "private");
}
