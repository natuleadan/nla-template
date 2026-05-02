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

let commentsData: Comment[] = CommentSchema.array().parse(JSON.parse(JSON.stringify(seedData)));

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

// ─── Redis-backed comment operations (for tools) ───────

export async function getApprovedComments(postSlug: string): Promise<Comment[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return (await getComments(postSlug)).filter((c) => c.status === "approved");

    const ids = await setMembers(`bus:comments:approved:${postSlug}`);
    const comments: Comment[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:comment:${id}`);
      if (h && h.visibility !== "private") {
        comments.push({
          id, postSlug: h.postSlug || postSlug, name: h.name || "",
          comment: h.comment || "", createdAt: h.createdAt || "",
          status: "approved", visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return comments;
  } catch { return (await getComments(postSlug)).filter((c) => c.status === "approved"); }
}

export async function createRedisComment(
  postSlug: string,
  data: { name: string; comment: string },
  phone: string,
): Promise<Comment | null> {
  try {
    const { isRedisConfigured, nextId, hashSet, setAdd } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return createComment(postSlug, data);

    const id = String(await nextId("bus:comment:id:counter"));
    const now = new Date().toISOString();
    await hashSet(`bus:comment:${id}`, "postSlug", postSlug);
    await hashSet(`bus:comment:${id}`, "name", data.name);
    await hashSet(`bus:comment:${id}`, "comment", data.comment);
    await hashSet(`bus:comment:${id}`, "visibility", "public");
    await hashSet(`bus:comment:${id}`, "status", "pending");
    await hashSet(`bus:comment:${id}`, "phone", phone);
    await hashSet(`bus:comment:${id}`, "createdAt", now);
    await setAdd("bus:comments:pending", id);
    await setAdd(`bus:comments:my:${phone}`, id);
    return { id, postSlug, name: data.name, comment: data.comment, createdAt: now, status: "pending", visibility: "public", phone };
  } catch { return createComment(postSlug, data); }
}

export async function getPendingComments(): Promise<Comment[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers("bus:comments:pending");
    const comments: Comment[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:comment:${id}`);
      if (h) {
        comments.push({
          id, postSlug: h.postSlug || "", name: h.name || "",
          comment: h.comment || "", createdAt: h.createdAt || "",
          status: "pending", visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return comments;
  } catch { return []; }
}

export async function approveComment(id: string): Promise<boolean> {
  try {
    const { isRedisConfigured, hashGet, hashSet, setRemove, setAdd } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;

    const slug = await hashGet(`bus:comment:${id}`, "postSlug");
    if (!slug) return false;

    await hashSet(`bus:comment:${id}`, "status", "approved");
    await setRemove("bus:comments:pending", id);
    await setAdd(`bus:comments:approved:${slug}`, id);
    return true;
  } catch { return false; }
}

export async function rejectComment(id: string): Promise<boolean> {
  try {
    const { isRedisConfigured, setRemove } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;
    await setRemove("bus:comments:pending", id);
    return true;
  } catch { return false; }
}

export async function setCommentVisibility(id: string, visibility: "public" | "private"): Promise<boolean> {
  try {
    const { isRedisConfigured, hashSet } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;
    await hashSet(`bus:comment:${id}`, "visibility", visibility);
    return true;
  } catch { return false; }
}

export async function getMyComments(phone: string): Promise<Comment[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers(`bus:comments:my:${phone}`);
    const comments: Comment[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:comment:${id}`);
      if (h) {
        comments.push({
          id, postSlug: h.postSlug || "", name: h.name || "",
          comment: h.comment || "", createdAt: h.createdAt || "",
          status: h.status as "pending" | "approved",
          visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return comments;
  } catch { return []; }
}
