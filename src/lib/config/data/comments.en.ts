import type { Comment } from "@/lib/modules/comments";

export const commentsData: Comment[] = [
  {
    id: "1",
    postSlug: "beneficios-de-la-proteina",
    name: "Ana G.",
    comment: "Great article, it helped me better understand how to incorporate protein into my diet.",
    createdAt: "2026-04-14T10:00:00Z",
    status: "approved",
  },
  {
    id: "2",
    postSlug: "beneficios-de-la-proteina",
    name: "Luis M.",
    comment: "Do you recommend any particular plant-based protein source?",
    createdAt: "2026-04-13T10:00:00Z",
    status: "approved",
  },
  {
    id: "3",
    postSlug: "guia-de-nutricion",
    name: "Sofía R.",
    comment: "Excellent tips, I'll start including more variety in my meals.",
    createdAt: "2026-04-16T10:00:00Z",
    status: "approved",
  },
  {
    id: "4",
    postSlug: "guia-de-nutricion",
    name: "Pedro L.",
    comment: "Could you recommend a weekly meal plan? Great article.",
    createdAt: "2026-04-15T10:00:00Z",
    status: "approved",
  },
];
