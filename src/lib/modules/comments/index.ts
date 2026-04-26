import { commentsData as seedData } from "@/lib/config/comments";

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  comment: string;
  createdAt: string;
  status: "pending" | "published";
}

let commentsData: Comment[] = JSON.parse(JSON.stringify(seedData));

export async function getComments(postSlug: string): Promise<Comment[]> {
  if (!postSlug || typeof postSlug !== "string") return [];
  return commentsData.filter((c) => c.postSlug === postSlug);
}

export async function createComment(
  postSlug: string,
  data: { name: string; comment: string },
): Promise<Comment> {
  const newComment: Comment = {
    id: String(commentsData.length + 1),
    postSlug,
    name: String(data.name).trim(),
    comment: String(data.comment).trim(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  commentsData.push(newComment);
  return newComment;
}

export async function deleteComments(postSlug: string): Promise<number> {
  const before = commentsData.length;
  commentsData = commentsData.filter((c) => c.postSlug !== postSlug);
  return before - commentsData.length;
}

export async function clearComments(): Promise<void> {
  commentsData.length = 0;
}
