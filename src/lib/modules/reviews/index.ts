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

const reviews: Review[] = ReviewSchema.array().parse(seedData);

export async function getReviews(productSlug: string): Promise<Review[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return reviews.filter((r) => r.productSlug === productSlug);
}

export async function getApprovedReviews(slug: string): Promise<Review[]> {
  return reviews.filter((r) => r.productSlug === slug && r.status === "approved" && r.visibility !== "private");
}
