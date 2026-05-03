import { reviewsData as reviewsDataEs } from "@/lib/config/data/reviews.es";
import { reviewsData as reviewsDataEn } from "@/lib/config/data/reviews.en";
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

const allReviews = {
  es: ReviewSchema.array().parse(reviewsDataEs),
  en: ReviewSchema.array().parse(reviewsDataEn),
};

function getData(locale = "es") {
  return allReviews[locale as keyof typeof allReviews] || allReviews.es;
}

export async function getReviews(productSlug: string, locale = "es"): Promise<Review[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return getData(locale).filter((r) => r.productSlug === productSlug);
}

export async function getApprovedReviews(slug: string, locale = "es"): Promise<Review[]> {
  return getData(locale).filter((r) => r.productSlug === slug && r.status === "approved" && r.visibility !== "private");
}
