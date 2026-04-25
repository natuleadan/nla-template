export interface Review {
  id: string;
  productSlug: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

let reviewsData: Review[] = [
  { id: "1", productSlug: "proteina-whey", name: "Carlos M.", comment: "Excelente proteína, se disuelve perfecto.", rating: 5, createdAt: "2026-04-15T10:00:00Z" },
  { id: "2", productSlug: "proteina-whey", name: "Juan P.", comment: "Buena calidad, vale la pena.", rating: 4, createdAt: "2026-04-10T10:00:00Z" },
  { id: "3", productSlug: "creatina-monohidratada", name: "Miguel R.", comment: "He notado mejora en mis entrenamientos.", rating: 5, createdAt: "2026-04-12T10:00:00Z" },
];

export async function getReviews(productSlug: string): Promise<Review[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return reviewsData.filter((r) => r.productSlug === productSlug);
}

export async function createReview(
  productSlug: string,
  data: { name: string; comment: string; rating: number }
): Promise<Review> {
  const newReview: Review = {
    id: String(reviewsData.length + 1),
    productSlug,
    name: String(data.name).trim(),
    comment: String(data.comment).trim(),
    rating: Math.round(Number(data.rating)),
    createdAt: new Date().toISOString(),
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