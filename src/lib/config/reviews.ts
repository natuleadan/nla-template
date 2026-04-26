import type { Review } from "@/lib/modules/reviews";

export const reviewsData: Review[] = [
  {
    id: "1",
    productSlug: "proteina-whey",
    name: "Carlos M.",
    comment: "Excelente proteína, se disuelve perfecto.",
    rating: 5,
    createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "2",
    productSlug: "proteina-whey",
    name: "Juan P.",
    comment: "Buena calidad, vale la pena.",
    rating: 4,
    createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "3",
    productSlug: "creatina-monohidratada",
    name: "Miguel R.",
    comment: "He notado mejora en mis entrenamientos.",
    rating: 5,
    createdAt: "2026-04-12T10:00:00Z",
  },
];
