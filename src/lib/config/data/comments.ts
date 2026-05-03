import type { Comment } from "@/lib/modules/comments";

export const commentsData: Comment[] = [
  {
    id: "1",
    postSlug: "beneficios-de-la-proteina",
    name: "Ana G.",
    comment: "Muy buen artículo, me ayudó a entender mejor cómo incorporar proteína en mi dieta.",
    createdAt: "2026-04-14T10:00:00Z",
    status: "approved",
  },
  {
    id: "2",
    postSlug: "beneficios-de-la-proteina",
    name: "Luis M.",
    comment: "¿Recomiendas alguna fuente de proteína vegetal en particular?",
    createdAt: "2026-04-13T10:00:00Z",
    status: "approved",
  },
  {
    id: "3",
    postSlug: "guia-de-nutricion",
    name: "Sofía R.",
    comment: "Excelentes consejos, empezaré a incluir más variedad en mis comidas.",
    createdAt: "2026-04-16T10:00:00Z",
    status: "approved",
  },
  {
    id: "4",
    postSlug: "guia-de-nutricion",
    name: "Pedro L.",
    comment: "¿Podrías recomendar un plan de comidas semanal? Muy buen artículo.",
    createdAt: "2026-04-15T10:00:00Z",
    status: "approved",
  },
];
