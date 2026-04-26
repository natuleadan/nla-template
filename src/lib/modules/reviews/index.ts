import { reviewsData as seedData } from "@/lib/config/reviews";

export interface Review {
  id: string;
  productSlug: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
  status: "pending" | "published";
}

let reviewsData: Review[] = JSON.parse(JSON.stringify(seedData));

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
