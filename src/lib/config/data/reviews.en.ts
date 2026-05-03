import type { Review } from "@/lib/modules/reviews";

export const reviewsData: Review[] = [
  {
    id: "1",
    productSlug: "proteina-whey",
    name: "Carlos M.",
    comment: "Excellent protein, dissolves perfectly.",
    rating: 5,
    createdAt: "2026-04-15T10:00:00Z",
    status: "approved",
  },
  {
    id: "2",
    productSlug: "proteina-whey",
    name: "Juan P.",
    comment: "Good quality, worth it.",
    rating: 4,
    createdAt: "2026-04-10T10:00:00Z",
    status: "approved",
  },
  {
    id: "3",
    productSlug: "creatina-monohidratada",
    name: "Miguel R.",
    comment: "I've noticed improvement in my workouts.",
    rating: 5,
    createdAt: "2026-04-12T10:00:00Z",
    status: "approved",
  },
];
