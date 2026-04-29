import { reviewsData as seedData } from "@/lib/config/data/reviews";
import { ReviewSchema } from "./schemas";

export interface Review {
  id: string;
  productSlug: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
  status: "pending" | "approved";
  visibility?: "public" | "private";
  phone?: string;
}

let reviewsData: Review[] = ReviewSchema.array().parse(JSON.parse(JSON.stringify(seedData)));

export async function getReviews(productSlug: string): Promise<Review[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return reviewsData.filter((r) => r.productSlug === productSlug);
}

export async function createReview(
  productSlug: string,
  data: { name: string; comment: string; rating: number },
): Promise<Review> {
  const newReview: Review = {
    id: String(reviewsData.length + 1),
    productSlug,
    name: String(data.name).trim(),
    comment: String(data.comment).trim(),
    rating: Math.round(Number(data.rating)),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  reviewsData.push(newReview);
  return newReview;
}

export async function deleteReviews(productSlug: string): Promise<number> {
  const before = reviewsData.length;
  reviewsData = reviewsData.filter((r) => r.productSlug !== productSlug);
  return before - reviewsData.length;
}

export async function clearReviews(): Promise<void> {
  reviewsData.length = 0;
}

// ─── Redis-backed review operations (for tools) ────────

export async function getApprovedReviews(slug: string): Promise<Review[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return getReviews(slug).filter((r) => r.status === "approved");

    const ids = await setMembers(`bus:reviews:approved:${slug}`);
    const reviews: Review[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:review:${id}`);
      if (h && h.visibility !== "private") {
        reviews.push({
          id, productSlug: h.productSlug || slug, name: h.name || "",
          comment: h.comment || "", rating: Number(h.rating || 0),
          createdAt: h.createdAt || "", status: "approved", visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return reviews;
  } catch { return getReviews(slug).filter((r) => r.status === "approved"); }
}

export async function createRedisReview(
  productSlug: string,
  data: { name: string; comment: string; rating: number },
  phone: string,
): Promise<Review | null> {
  try {
    const { isRedisConfigured, nextId, hashSet, setAdd } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return createReview(productSlug, data);

    const id = String(await nextId("bus:review:id:counter"));
    const now = new Date().toISOString();
    await hashSet(`bus:review:${id}`, "productSlug", productSlug);
    await hashSet(`bus:review:${id}`, "name", data.name);
    await hashSet(`bus:review:${id}`, "comment", data.comment);
    await hashSet(`bus:review:${id}`, "rating", String(data.rating));
    await hashSet(`bus:review:${id}`, "visibility", "public");
    await hashSet(`bus:review:${id}`, "status", "pending");
    await hashSet(`bus:review:${id}`, "phone", phone);
    await hashSet(`bus:review:${id}`, "createdAt", now);
    await setAdd("bus:reviews:pending", id);
    await setAdd(`bus:reviews:my:${phone}`, id);
    return { id, productSlug, name: data.name, comment: data.comment, rating: data.rating, createdAt: now, status: "pending", visibility: "public", phone };
  } catch { return createReview(productSlug, data); }
}

export async function getPendingReviews(): Promise<Review[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers("bus:reviews:pending");
    const reviews: Review[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:review:${id}`);
      if (h) {
        reviews.push({
          id, productSlug: h.productSlug || "", name: h.name || "",
          comment: h.comment || "", rating: Number(h.rating || 0),
          createdAt: h.createdAt || "", status: "pending", visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return reviews;
  } catch { return []; }
}

export async function approveReview(id: string): Promise<boolean> {
  try {
    const { isRedisConfigured, hashGet, hashSet, setRemove, setAdd } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;

    const slug = await hashGet(`bus:review:${id}`, "productSlug");
    if (!slug) return false;

    await hashSet(`bus:review:${id}`, "status", "approved");
    await setRemove("bus:reviews:pending", id);
    await setAdd(`bus:reviews:approved:${slug}`, id);
    return true;
  } catch { return false; }
}

export async function rejectReview(id: string): Promise<boolean> {
  try {
    const { isRedisConfigured, setRemove } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;

    await setRemove("bus:reviews:pending", id);
    await setRemove(`bus:reviews:my:*`, id);
    return true;
  } catch { return false; }
}

export async function setReviewVisibility(id: string, visibility: "public" | "private"): Promise<boolean> {
  try {
    const { isRedisConfigured, hashSet } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;
    await hashSet(`bus:review:${id}`, "visibility", visibility);
    return true;
  } catch { return false; }
}

export async function getMyReviews(phone: string): Promise<Review[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers(`bus:reviews:my:${phone}`);
    const reviews: Review[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:review:${id}`);
      if (h) {
        reviews.push({
          id, productSlug: h.productSlug || "", name: h.name || "",
          comment: h.comment || "", rating: Number(h.rating || 0),
          createdAt: h.createdAt || "", status: h.status as "pending" | "approved",
          visibility: (h.visibility as "public" | "private") || "public",
        });
      }
    }
    return reviews;
  } catch { return []; }
}
