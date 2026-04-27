import type { Comment } from "@/lib/modules/comments";

export const commentsData: Comment[] = [
  {
    id: "1",
    postSlug: "beneficios-de-la-proteina",
    name: "Ana G.",
    comment: "Muy buen artículo, me ayudó a entender mejor cómo tomar la proteína.",
    createdAt: "2026-04-14T10:00:00Z",
    status: "published",
  },
  {
    id: "2",
    postSlug: "beneficios-de-la-proteina",
    name: "Luis M.",
    comment: "¿Recomiendas tomarla antes o después del entrenamiento?",
    createdAt: "2026-04-13T10:00:00Z",
    status: "published",
  },
  {
    id: "3",
    postSlug: "nutricion-para-el-gym",
    name: "Sofía R.",
    comment: "Excelentes consejos, empezaré a incluir más proteína en mis comidas.",
    createdAt: "2026-04-16T10:00:00Z",
    status: "published",
  },
  {
    id: "4",
    postSlug: "nutricion-para-el-gym",
    name: "Pedro L.",
    comment: "¿Podrías recomendar un plan de comidas semanal? Muy buen artículo.",
    createdAt: "2026-04-15T10:00:00Z",
    status: "published",
  },
];
