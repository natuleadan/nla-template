import type { Review } from "@/lib/modules/reviews";

export const reviewsData: Review[] = [
  {
    id: "1",
    productSlug: "proteina-whey",
    name: "كارلوس م.",
    comment: "بروتين ممتاز، يذوب تماماً.",
    rating: 5,
    createdAt: "2026-04-15T10:00:00Z",
    status: "approved",
  },
  {
    id: "2",
    productSlug: "proteina-whey",
    name: "خوان ب.",
    comment: "جودة جيدة، تستحق الثمن.",
    rating: 4,
    createdAt: "2026-04-10T10:00:00Z",
    status: "approved",
  },
  {
    id: "3",
    productSlug: "creatina-monohidratada",
    name: "ميغيل ر.",
    comment: "لاحظت تحسناً في تدريباتي.",
    rating: 5,
    createdAt: "2026-04-12T10:00:00Z",
    status: "approved",
  },
];
